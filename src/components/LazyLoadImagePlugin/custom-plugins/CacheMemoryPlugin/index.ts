import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface MemoryCacheConfig {
  enabled?: boolean;
  maxEntries?: number; // LRU 最大条目
  ttlMs?: number; // 过期时间，默认不过期
  debug?: boolean;
}

type Entry = { value: string; time: number };

// 简单的全局 LRU 内存缓存（跨组件实例共享）
const store = new Map<string, Entry>();
const order: string[] = [];

function now() {
  return Date.now();
}

function evictIfNeeded(maxEntries: number) {
  if (maxEntries <= 0) return;
  while (order.length > maxEntries) {
    const oldest = order.shift();
    if (oldest && store.has(oldest)) {
      store.delete(oldest);
    }
  }
}

function touch(key: string) {
  const idx = order.indexOf(key);
  if (idx >= 0) order.splice(idx, 1);
  order.push(key);
}

function getFromMemory(key: string, ttlMs?: number): string | undefined {
  const e = store.get(key);
  if (!e) return undefined;
  if (ttlMs && ttlMs > 0 && now() - e.time > ttlMs) {
    store.delete(key);
    const idx = order.indexOf(key);
    if (idx >= 0) order.splice(idx, 1);
    return undefined;
  }
  touch(key);
  return e.value;
}

function setToMemory(key: string, value: string, maxEntries: number) {
  store.set(key, { value, time: now() });
  touch(key);
  evictIfNeeded(maxEntries);
}

export const MemoryCache = {
  get: getFromMemory,
  set: setToMemory,
  has: (key: string, ttlMs?: number) => getFromMemory(key, ttlMs) !== undefined,
  clear: () => {
    store.clear();
    order.splice(0, order.length);
  },
  size: () => store.size,
};

export function createMemoryCachePlugin(config: MemoryCacheConfig = {}): LazyImagePlugin {
  const { enabled = true, maxEntries = 200, ttlMs, debug = false } = config;

  // 跟踪由缓存返回的 objectURL，便于在卸载或切换时回收
  const createdObjectURLs = new Map<string, string>();

  return {
    name: "cache-memory",
    version: "1.0.0",
    config,
    hooks: {
      onLoad: async (context: PluginContext) => {
        if (!enabled) return undefined;
        const hit = getFromMemory(context.src, ttlMs);
        if (hit) {
          if (debug) {
            try { console.debug("[MemoryCache] hit", { src: context.src }); } catch {}
          }
          context.bus?.emit("cache:hit", { level: "memory", src: context.src });
          // 不返回已缓存的 blob: URL，避免引用已撤销的对象 URL
          if (!hit.startsWith("blob:")) {
            return hit; // 返回替代 src
          }
        }
        return undefined;
      },
      onLoadSuccess: (context: PluginContext, displaySrc: string) => {
        if (!enabled) return;
        // 仅缓存非 blob: 的字符串，blob 交由 IDB 缓存处理
        if (!displaySrc.startsWith("blob:")) {
          setToMemory(context.src, displaySrc, maxEntries);
        }
        if (debug) {
          try { console.debug("[MemoryCache] set", { src: context.src, length: displaySrc.length }); } catch {}
        }
      },
      onSrcChange: (context: PluginContext, oldSrc: string, newSrc: string) => {
        if (!enabled) return;
        // 轻量策略：不主动迁移旧 key，仅按需命中
        context.bus?.emit("cache:src-change", { oldSrc, newSrc });
        const old = createdObjectURLs.get(oldSrc);
        if (old) {
          try { URL.revokeObjectURL(old); } catch {}
          createdObjectURLs.delete(oldSrc);
        }
      },
      onUnmount: (context: PluginContext) => {
        // 可选：不在卸载时清除，以提高复用率
        // 若需要激进清理，可在此删除：store.delete(context.src)
        const url = createdObjectURLs.get(context.src);
        if (url) {
          try { URL.revokeObjectURL(url); } catch {}
          createdObjectURLs.delete(context.src);
        }
      },
    },
  };
}