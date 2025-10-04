import type { LazyImagePlugin, PluginContext } from "./types";

export interface FetchLoaderPluginConfig {
  enabled?: boolean;
  /** 自定义去重键（默认使用 src） */
  cacheKeyFn?: (src: string) => string;
}

// 简单的 in-flight 去重映射：同一 key 共享一次真实下载
const inFlight = new Map<string, Promise<string>>();
// 记录进行中的请求与已创建的 objectURL，便于在离开视口或卸载时清理
const controllers = new Map<string, AbortController>();
const objectUrls = new Map<string, string>();

export function createFetchLoaderPlugin(
  config: FetchLoaderPluginConfig = {}
): LazyImagePlugin {
  const { enabled = true, cacheKeyFn } = config;

  const keyFromContext = (context: PluginContext) =>
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

      const res = await fetch(url, { signal });
      if (!res.ok || !res.body) {
        // 回退：直接返回原始 URL，由核心 <img> 触发加载
        controllers.delete(key);
        return url;
      }

      const totalHeader = res.headers.get("Content-Length") || res.headers.get("content-length");
      const total = Number(totalHeader || 0);
      const reader = res.body.getReader();
      const chunks: Uint8Array[] = [];
      let loaded = 0;
      const indeterminate = !total || total <= 0;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            loaded += value.length;
            // 通过总线广播进度（HOC 会转发到 onProgress 钩子）
            context.bus?.emit("progress", {
              loaded,
              total,
              percent: total > 0 ? Math.round((loaded / total) * 100) : 0,
              indeterminate,
            });
          }
        }
      } finally {
        // 读取结束（无论成功或中断）后移除控制器
        controllers.delete(key);
      }

      // 在部分 TS DOM 类型定义下，Uint8Array<ArrayBufferLike> 与 BlobPart 存在类型不兼容，显式断言为 BlobPart 修复
      const blob = new Blob(chunks as unknown as BlobPart[]);
      const objectUrl = URL.createObjectURL(blob);
      // 将原始 Blob 暂存到 sharedData，供后续缓存插件复用，避免二次 fetch(blob:)
      try { context.sharedData?.set("fetch-loader:blob", blob); } catch {}
      objectUrls.set(key, objectUrl);
      // 完成时广播 100%
      context.bus?.emit("progress", {
        loaded,
        total,
        percent: 100,
        indeterminate: false,
      });
      return objectUrl;
    })();

    inFlight.set(key, task);
    try {
      const result = await task;
      inFlight.delete(key);
      return result;
    } catch (e) {
      inFlight.delete(key);
      throw e;
    }
  }

  return {
    name: "fetch-loader",
    version: "1.0.0",
    config,
    hooks: {
      onLoad: async (context) => {
        if (!enabled) return undefined;
        try {
          const displaySrc = await loadAsObjectURL(context);
          return displaySrc; // 返回替代 src（objectURL 或原始 URL）
        } catch (error) {
          // 失败时让核心走默认流程并触发 onLoadError
          return undefined;
        }
      },
      onLeaveViewport: (context) => {
        if (!enabled) return;
        // 离开视口仅中断未完成的下载，避免撤销仍在使用的 objectURL
        abortInFlight(context);
      },
      onSrcChange: (context, _oldSrc, _newSrc) => {
        if (!enabled) return;
        // 当图片源发生变化时回收旧的 objectURL，避免泄漏
        revokeObjectURL(context);
      },
      onUnmount: (context) => {
        if (!enabled) return;
        // 组件卸载时中断并回收，避免悬挂的请求和内存泄漏
        abortInFlight(context);
        revokeObjectURL(context);
      },
    },
  } as LazyImagePlugin;
}