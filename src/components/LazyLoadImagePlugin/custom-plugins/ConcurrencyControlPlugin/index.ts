import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface ConcurrencyControlConfig {
  /** 并发上限（4g 情况的上限） */
  maxConcurrent?: number;
  /** 作用域：全局或按域名分片 */
  scope?: "global" | "perHost";
  /** 是否根据网络自适应并发（saveData/2g/3g 降低并发） */
  adaptive?: boolean;
  /** 获取并发许可的超时（毫秒），超时后不阻塞加载，避免饥饿 */
  acquireTimeoutMs?: number;
  /** 调试输出 */
  debug?: boolean;
}

type QueueEntry = { resolve: () => void; reject?: (err: any) => void; timer?: any };
type BucketState = { current: number; queue: QueueEntry[] };

/**
 * 简单并发门控（全局单例），按 bucketKey 管理并发与等待队列。
 */
const ConcurrencyGate = (() => {
  const buckets = new Map<string, BucketState>();

  function getBucket(key: string): BucketState {
    let b = buckets.get(key);
    if (!b) {
      b = { current: 0, queue: [] };
      buckets.set(key, b);
    }
    return b;
  }

  async function acquire(key: string, max: number, debug?: boolean, timeoutMs?: number): Promise<void> {
    const bucket = getBucket(key);
    if (bucket.current < max) {
      bucket.current += 1;
      if (debug) console.debug(`[ConcurrencyGate] acquire immediate: ${key} -> ${bucket.current}/${max}`);
      return;
    }
    // 挂入队列，等待释放
    if (debug) console.debug(`[ConcurrencyGate] queued: ${key} size=${bucket.queue.length + 1}`);
    await new Promise<void>((resolve, reject) => {
      const entry: QueueEntry = {
        resolve: () => {
          if (entry.timer) clearTimeout(entry.timer);
          bucket.current += 1;
          if (debug) console.debug(`[ConcurrencyGate] acquire from queue: ${key} -> ${bucket.current}/${max}`);
          resolve();
        },
        reject,
      };
      if (timeoutMs && timeoutMs > 0) {
        entry.timer = setTimeout(() => {
          // 超时：从队列移除并拒绝
          const idx = bucket.queue.indexOf(entry);
          if (idx >= 0) bucket.queue.splice(idx, 1);
          if (debug) console.debug(`[ConcurrencyGate] acquire timeout: ${key} after ${timeoutMs}ms`);
          reject?.(new Error(`acquire timeout for ${key}`));
        }, timeoutMs);
      }
      bucket.queue.push(entry);
    });
  }

  function release(key: string, max: number, debug?: boolean) {
    const bucket = getBucket(key);
    if (bucket.current > 0) bucket.current -= 1;
    if (debug) console.debug(`[ConcurrencyGate] release: ${key} -> ${bucket.current}/${max}`);
    // 触发队列中的下一个
    const next = bucket.queue.shift();
    if (next) {
      // 立即让下一个进入，占位在 next 中完成
      next.resolve();
    }
  }

  return { acquire, release };
})();

function getBucketKey(src: string, scope: "global" | "perHost"): string {
  if (scope === "global") return "__global__";
  try {
    const u = new URL(src, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    return `host:${u.hostname}`;
  } catch {
    return "__global__";
  }
}

/**
 * createConcurrencyControlPlugin
 * 在 onLoad 阶段阻塞，直到并发许可获取到，再交由下游加载器执行。
 * 在 onLoadSuccess/onLoadError 阶段释放并发占位。
 */
export function createConcurrencyControlPlugin(
  config: ConcurrencyControlConfig = {}
): LazyImagePlugin {
  const { maxConcurrent = 4, scope = "global", adaptive = true, acquireTimeoutMs = 8000, debug = false } = config;

  function computeAdaptiveMax(base: number, ctx: PluginContext): number {
    if (!adaptive) return base;
    const eff = ctx.networkInfo?.effectiveType;
    const saveData = ctx.networkInfo?.saveData;
    if (saveData) return 1;
    switch (eff) {
      case "slow-2g":
      case "2g":
        return 1;
      case "3g":
        return Math.max(1, Math.floor(base / 2));
      case "4g":
      default:
        return base;
    }
  }

  return {
    name: "concurrency-control",
    version: "1.0.0",
    config,
    hooks: {
      onLoad: async (context: PluginContext) => {
        const key = getBucketKey(context.src, scope);
        const adaptiveMax = computeAdaptiveMax(maxConcurrent, context);
        try {
          await ConcurrencyGate.acquire(key, adaptiveMax, debug, acquireTimeoutMs);
        } catch (e) {
          if (debug) console.debug(`[ConcurrencyControl] proceed without permit due to:`, e);
          // 超时或异常时，允许继续加载，避免卡死
          return undefined;
        }
        // 将占位信息记录到 sharedData，供释放阶段使用
        try { context.sharedData?.set("cc:key", key); } catch {}
        // 不返回替代 src，交由后置的加载器（如 fetch-loader）处理
        return undefined;
      },
      onLoadSuccess: (context: PluginContext) => {
        const key = (context.sharedData?.get("cc:key") as string) || getBucketKey(context.src, scope);
        const adaptiveMax = computeAdaptiveMax(maxConcurrent, context);
        ConcurrencyGate.release(key, adaptiveMax, debug);
      },
      onLoadError: (context: PluginContext) => {
        const key = (context.sharedData?.get("cc:key") as string) || getBucketKey(context.src, scope);
        const adaptiveMax = computeAdaptiveMax(maxConcurrent, context);
        ConcurrencyGate.release(key, adaptiveMax, debug);
        return true;
      },
      onUnmount: (context: PluginContext) => {
        // 若组件卸载但仍处在并发占位状态，进行释放以避免“幽灵占位”
        const key = context.sharedData?.get("cc:key");
        if (typeof key === "string") {
          const adaptiveMax = computeAdaptiveMax(maxConcurrent, context as any);
          ConcurrencyGate.release(key, adaptiveMax, debug);
          try { context.sharedData?.delete("cc:key"); } catch {}
        }
      },
    },
  };
}