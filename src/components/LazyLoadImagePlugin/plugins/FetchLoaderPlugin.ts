import { FETCH_LOADER_DEFAULTS, HTTP_STATUS } from "../constants";
import type { LazyImagePlugin, PluginContext, ProgressInfo } from "./types";

import { LRUCache } from "../utils/LRUCache";

/**
 * Issue #27: 速度计算器（移动平均）
 *
 * 使用滑动窗口计算下载速度，提供更稳定的速度估算
 */
class SpeedCalculator {
  private samples: Array<{ bytes: number; timestamp: number }> = [];
  private readonly windowSize: number;
  private readonly maxSamples: number;

  constructor(windowSize = 1000, maxSamples = 10) {
    this.windowSize = windowSize; // 时间窗口（毫秒）
    this.maxSamples = maxSamples; // 最大样本数
  }

  /**
   * 添加进度样本
   */
  addSample(loaded: number): void {
    const now = Date.now();
    this.samples.push({ bytes: loaded, timestamp: now });

    // 清理超出时间窗口的样本
    const cutoff = now - this.windowSize;
    this.samples = this.samples.filter((s) => s.timestamp > cutoff);

    // 限制样本数量
    if (this.samples.length > this.maxSamples) {
      this.samples.shift();
    }
  }

  /**
   * 计算当前速度（字节/秒）
   */
  getSpeed(): number {
    if (this.samples.length < 2) return 0;

    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];

    const bytes = last.bytes - first.bytes;
    const time = (last.timestamp - first.timestamp) / 1000; // 秒

    if (time <= 0) return 0;

    return bytes / time;
  }

  /**
   * 估算剩余时间（秒）
   */
  estimateTimeRemaining(loaded: number, total: number): number {
    const speed = this.getSpeed();
    if (speed <= 0 || total <= 0) return 0;

    const remaining = total - loaded;
    return remaining / speed;
  }

  /**
   * 重置计算器
   */
  reset(): void {
    this.samples = [];
  }
}

export interface FetchLoaderPluginConfig {
  enabled?: boolean;
  /** 自定义去重键（默认使用 src） */
  cacheKeyFn?: (src: string) => string;
  /** Issue #3: LRU 缓存最大条目数 */
  maxCacheSize?: number;
  maxControllers?: number;
  maxObjectUrls?: number;
  /** Issue #14: 请求超时时间（毫秒），默认 30000ms */
  timeout?: number;
  /** Issue #15: 最大重试次数，默认 3 */
  maxRetries?: number;
  /** Issue #15: 初始重试延迟（毫秒），默认 1000ms */
  retryDelay?: number;
  /** Issue #15: 重试退避倍数，默认 2 */
  retryBackoff?: number;
}

// Issue #3: 使用 LRU 缓存替代无限增长的 Map
// Issue #31: 使用常量替代魔法数字

// in-flight 请求缓存
const inFlight = new LRUCache<string, Promise<string>>(FETCH_LOADER_DEFAULTS.CACHE_SIZE_INFLIGHT);

// 控制器缓存，自动中止被淘汰的请求
const controllers = new LRUCache<string, AbortController>(
  FETCH_LOADER_DEFAULTS.CACHE_SIZE_CONTROLLERS,
  (key, ctrl) => {
    try {
      ctrl.abort();
    } catch (error) {
      // 忽略已中止的错误
    }
  }
);

// objectURL 缓存，自动 revoke 被淘汰的 URL
const objectUrls = new LRUCache<string, string>(
  FETCH_LOADER_DEFAULTS.CACHE_SIZE_OBJECT_URLS,
  (key, url) => {
    try {
      URL.revokeObjectURL(url);
    } catch (error) {
      // 忽略已 revoke 的错误
    }
  }
);

/**
 * 创建 FetchLoader 插件（Issue #20: 类型安全的配置）
 * @param config - 插件配置
 * @returns 类型化的插件实例
 */
export function createFetchLoaderPlugin(
  config: FetchLoaderPluginConfig = {}
): LazyImagePlugin<FetchLoaderPluginConfig> {
  const {
    enabled = true,
    cacheKeyFn,
    // Issue #31: 使用常量替代魔法数字
    timeout = FETCH_LOADER_DEFAULTS.TIMEOUT,
    maxRetries = FETCH_LOADER_DEFAULTS.MAX_RETRIES,
    retryDelay = FETCH_LOADER_DEFAULTS.RETRY_DELAY,
    retryBackoff = FETCH_LOADER_DEFAULTS.RETRY_BACKOFF,
  } = config;

  const keyFromContext = (context: PluginContext<FetchLoaderPluginConfig>) =>
    cacheKeyFn ? cacheKeyFn(context.src) : context.src;

  const abortInFlight = (context: PluginContext) => {
    const key = keyFromContext(context);
    const ctrl = controllers.get(key);
    if (ctrl) {
      try { ctrl.abort(); } catch {}
      controllers.delete(key);
    }
  };

  const revokeObjectURL = (context: PluginContext) => {
    const key = keyFromContext(context);
    const created = objectUrls.get(key);
    if (created) {
      try { URL.revokeObjectURL(created); } catch {}
      objectUrls.delete(key);
    }
  };

  // Issue #15: 带重试的加载函数
  async function fetchWithRetry(
    url: string,
    signal: AbortSignal,
    attempt: number = 0
  ): Promise<Response> {
    try {
      // Issue #14: 创建超时 Promise
      const fetchPromise = fetch(url, { signal });
      const timeoutPromise = new Promise<Response>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Fetch timeout after ${timeout}ms`));
        }, timeout);
      });

      // 竞速：fetch 和 timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      // 检查 HTTP 状态
      if (!response.ok) {
        // Issue #31: 使用常量替代魔法数字
        // 4xx 错误（客户端错误）通常不重试
        if (response.status >= HTTP_STATUS.CLIENT_ERROR_MIN && response.status < HTTP_STATUS.CLIENT_ERROR_MAX) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        // 5xx 错误（服务器错误）可以重试
        throw new Error(`Server error: ${response.status}`);
      }

      return response;
    } catch (error: any) {
      // 请求被中止，直接抛出
      if (signal.aborted || error.name === 'AbortError') {
        throw error;
      }

      // 达到最大重试次数
      if (attempt >= maxRetries) {
        throw error;
      }

      // 不可重试的错误（404, 403 等）
      if (error.message && (
        error.message.includes('404') ||
        error.message.includes('403') ||
        error.message.includes('401')
      )) {
        throw error;
      }

      // Issue #15: 计算延迟（指数退避）
      const delay = retryDelay * Math.pow(retryBackoff, attempt);

      console.debug(
        `[FetchLoader] Retrying (${attempt + 1}/${maxRetries}) after ${delay}ms for ${url}`
      );

      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, delay));

      // 检查是否已被中止
      if (signal.aborted) {
        throw new Error('Request aborted during retry delay');
      }

      return fetchWithRetry(url, signal, attempt + 1);
    }
  }

  async function loadAsObjectURL(context: PluginContext): Promise<string> {
    const url = context.src;
    const key = cacheKeyFn ? cacheKeyFn(url) : url;

    if (inFlight.has(key)) {
      return inFlight.get(key)!;
    }

    const task = (async () => {
      const controller = new AbortController();
      const { signal } = controller;
      controllers.set(key, controller);

      // Issue #27: 创建速度计算器
      const speedCalc = new SpeedCalculator();

      try {
        // Issue #14 & #15: 使用带超时和重试的 fetch
        const res = await fetchWithRetry(url, signal);

        if (!res.body) {
          // 回退：直接返回原始 URL
          controllers.delete(key);
          return url;
        }

        // Issue #27: 获取内容长度用于进度计算
        const contentLength = res.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;

        // Issue #27: 流式读取以支持进度报告
        const reader = res.body.getReader();
        const chunks: BlobPart[] = [];
        let loaded = 0;

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            if (value) {
              chunks.push(value);
              loaded += value.length;

              // Issue #27: 更新速度计算器
              speedCalc.addSample(loaded);

              // Issue #27: 构建增强的进度信息
              const progress: ProgressInfo = {
                loaded,
                total,
                percent: total > 0 ? Math.round((loaded / total) * 100) : 0,
                indeterminate: total === 0,
                // 增强信息
                speed: speedCalc.getSpeed(),
                estimatedTime: speedCalc.estimateTimeRemaining(loaded, total),
                timestamp: Date.now(),
              };

              // 触发进度回调
              context.bus?.emit('progress', progress);
            }
          }
        } finally {
          reader.releaseLock();
        }

        // 合并所有 chunks
        const blob = new Blob(chunks);
        const objectURL = URL.createObjectURL(blob);

        objectUrls.set(key, objectURL);
        controllers.delete(key);

        return objectURL;
      } catch (err: any) {
        controllers.delete(key);

        // 如果是中止错误，静默处理
        if (err.name === 'AbortError' || signal.aborted) {
          return url;
        }

        // 其他错误，记录日志但回退到原始 URL
        console.warn(`[FetchLoader] Failed to load ${url}:`, err.message);
        return url;
      } finally {
        inFlight.delete(key);
      }
    })();

    inFlight.set(key, task);
    return task;
  }

  return {
    name: "fetch-loader",
    version: "1.0.0",
    priority: 10, // Issue #7: 高优先级，在其他插件之前执行
    config,
    hooks: {
      async onLoad(context: PluginContext): Promise<string | undefined> {
        if (!enabled) return undefined;
        try {
          const objectURL = await loadAsObjectURL(context);
          return objectURL;
        } catch (err) {
          console.warn("[FetchLoader] onLoad error:", err);
          return undefined;
        }
      },
      onUnmount(context: PluginContext) {
        abortInFlight(context);
        revokeObjectURL(context);
      },
    },
  };
}
