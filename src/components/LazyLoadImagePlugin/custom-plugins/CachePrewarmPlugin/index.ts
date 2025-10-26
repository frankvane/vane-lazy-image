import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

import { IDBCache } from "../CacheIDBPlugin/index";
import { MemoryCache } from "../CacheMemoryPlugin/index";

export interface CachePrewarmConfig {
  enabled?: boolean;
  trigger?: "enter" | "mount"; // 触发时机：进入视口或挂载
  preferMemory?: boolean; // 预热时优先写内存
  debug?: boolean;
}

async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// 由预热阶段创建的对象 URL，供卸载时清理
const createdObjectURLs = new Map<string, string>();

// ⭐ 添加预热状态追踪，防止重复预热和并发控制
const prewarmingKeys = new Set<string>();
const prewarmedKeys = new Set<string>();

async function prewarm(src: string, preferMemory: boolean, debug: boolean) {
  // ⭐ 防止重入：如果正在预热或已预热，跳过
  if (prewarmingKeys.has(src) || prewarmedKeys.has(src)) {
    if (debug) {
      try { console.debug("[CachePrewarm] skipped (already in progress or cached)", src); } catch {}
    }
    return;
  }

  prewarmingKeys.add(src);
  try {
    // ⭐ 添加超时控制（预热可以更长，10秒）
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(src, {
      cache: "force-cache",
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) return;
    const blob = await res.blob();
    // 内存：使用对象 URL，避免 base64 转码开销
    if (preferMemory) {
      const objURL = URL.createObjectURL(blob);
      MemoryCache.set(src, objURL, 200);
      createdObjectURLs.set(src, objURL);
    }
    // IDB：直接持久化 Blob
    await IDBCache.set(src, blob, { dbName: "LLI-Cache", storeName: "images", debug });

    // ⭐ 标记为已预热
    prewarmedKeys.add(src);

    if (debug) {
      try { console.debug("[CachePrewarm] prewarmed", { src, size: blob.size }); } catch {}
    }
  } catch (e: any) {
    // ⭐ 只在非超时错误时警告
    if (debug && e?.name !== 'AbortError') {
      try { console.warn("[CachePrewarm] failed", e); } catch {}
    }
  } finally {
    // ⭐ 清理预热中状态
    prewarmingKeys.delete(src);
  }
}

export function createCachePrewarmPlugin(config: CachePrewarmConfig = {}): LazyImagePlugin {
  const { enabled = true, trigger = "enter", preferMemory = true, debug = false } = config;

  return {
    name: "cache-prewarm",
    version: "1.0.0",
    config,
    hooks: {
      onMount: (context: PluginContext) => {
        if (!enabled || trigger !== "mount") return;
        // 若已有命中则不重复预热
        const hit = MemoryCache.get(context.src) || undefined;
        if (!hit) prewarm(context.src, preferMemory, debug);
      },
      onEnterViewport: (context: PluginContext) => {
        if (!enabled || trigger !== "enter") return;
        const hit = MemoryCache.get(context.src) || undefined;
        if (!hit) prewarm(context.src, preferMemory, debug);
      },
      onUnmount: (context: PluginContext) => {
        const url = createdObjectURLs.get(context.src);
        if (url) {
          try { URL.revokeObjectURL(url); } catch {}
          createdObjectURLs.delete(context.src);
        }
      },
    },
  };
}