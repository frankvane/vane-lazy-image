import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface IDBCacheConfig {
  enabled?: boolean;
  dbName?: string;
  storeName?: string;
  ttlMs?: number; // 过期时间（毫秒）
  debug?: boolean;
}

// IDB 中存储的结构：优先存 Blob，其次存字符串（dataURL 或原始 URL）
type IDBValue = { blob?: Blob; value?: string; time: number; mime?: string };

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(dbName: string, storeName: string): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(dbName, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise!;
}

// 读取原始存储值（用于插件内部决定返回何种 src）
async function idbGetRaw(
  key: string,
  cfg: Required<Pick<IDBCacheConfig, "dbName" | "storeName" | "ttlMs" | "debug">>
): Promise<IDBValue | undefined> {
  try {
    const db = await openDB(cfg.dbName, cfg.storeName);
    const tx = db.transaction(cfg.storeName, "readonly");
    const store = tx.objectStore(cfg.storeName);
    const value: IDBValue | undefined = await new Promise((resolve, reject) => {
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result as any);
      req.onerror = () => reject(req.error);
    });
    if (!value) return undefined;
    if (cfg.ttlMs > 0 && Date.now() - value.time > cfg.ttlMs) {
      // 过期，清理
      try {
        const tx2 = db.transaction(cfg.storeName, "readwrite");
        tx2.objectStore(cfg.storeName).delete(key);
      } catch {}
      return undefined;
    }
    return value;
  } catch (e) {
    if (cfg.debug) {
      try { console.warn("[IDBCache] get failed", e); } catch {}
    }
    return undefined;
  }
}

// 存储：优先写 Blob，其次写字符串
async function idbSet(
  key: string,
  value: string | Blob,
  cfg: Required<Pick<IDBCacheConfig, "dbName" | "storeName" | "debug">>
) {
  try {
    const db = await openDB(cfg.dbName, cfg.storeName);
    const tx = db.transaction(cfg.storeName, "readwrite");
    const store = tx.objectStore(cfg.storeName);
    const data: IDBValue =
      typeof value === "string"
        ? { value, time: Date.now() }
        : { blob: value, time: Date.now(), mime: value.type };
    await new Promise<void>((resolve, reject) => {
      const req = store.put(data, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    if (cfg.debug) {
      try { console.warn("[IDBCache] set failed", e); } catch {}
    }
  }
}

export const IDBCache = { get: idbGetRaw, set: idbSet };

// 将 dataURL 转为 Blob（避免 IDB 存储字符串的空间放大与解析成本）
function dataURLToBlob(dataUrl: string): Blob | null {
  try {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch {
    return null;
  }
}

export function createIDBCachePlugin(config: IDBCacheConfig = {}): LazyImagePlugin {
  const {
    enabled = true,
    dbName = "LLI-Cache",
    storeName = "images",
    ttlMs = 7 * 24 * 60 * 60 * 1000, // 默认 7 天
    debug = false,
  } = config;

  // 记录由缓存创建的 objectURL，以便在卸载时回收
  const createdObjectURLs = new Map<string, string>();

  return {
    name: "cache-idb",
    version: "1.0.0",
    config,
    hooks: {
      onLoad: async (context: PluginContext) => {
        if (!enabled) return undefined;
        const raw = await idbGetRaw(context.src, { dbName, storeName, ttlMs, debug });
        if (raw) {
          if (debug) {
            try { console.debug("[IDBCache] hit", { src: context.src }); } catch {}
          }
          context.bus?.emit("cache:hit", { level: "idb", src: context.src });
          if (raw.blob) {
            const url = URL.createObjectURL(raw.blob);
            createdObjectURLs.set(context.src, url);
            return url; // 返回对象 URL
          }
          // fallback: 返回字符串（dataURL 或原始 URL）
          return raw.value;
        }
        return undefined;
      },
      onLoadSuccess: async (context: PluginContext, displaySrc: string) => {
        if (!enabled) return;
        // 最佳实践：优先缓存 Blob，其次缓存字符串
        try {
          if (displaySrc.startsWith("blob:")) {
            // 优先使用 FetchLoader 暂存的原始 Blob，避免对 blob: 的二次请求
            const blobFromLoader = context.sharedData?.get("fetch-loader:blob") as Blob | undefined;
            if (blobFromLoader) {
              await idbSet(context.src, blobFromLoader, { dbName, storeName, debug });
            } else {
              // 回退：从 objectURL 取 Blob 存储（可能在 URL 被撤销时失败）
              const res = await fetch(displaySrc);
              const blob = await res.blob();
              await idbSet(context.src, blob, { dbName, storeName, debug });
            }
          } else if (displaySrc.startsWith("data:")) {
            const blob = dataURLToBlob(displaySrc);
            if (blob) {
              await idbSet(context.src, blob, { dbName, storeName, debug });
            } else {
              await idbSet(context.src, displaySrc, { dbName, storeName, debug });
            }
          } else {
            // 原始 URL：尝试拉取 Blob 存储；失败则存字符串
            try {
              const res = await fetch(displaySrc, { cache: "force-cache" });
              if (res.ok) {
                const blob = await res.blob();
                await idbSet(context.src, blob, { dbName, storeName, debug });
              } else {
                await idbSet(context.src, displaySrc, { dbName, storeName, debug });
              }
            } catch {
              await idbSet(context.src, displaySrc, { dbName, storeName, debug });
            }
          }
        } catch {
          // 忽略写入错误
        }
        if (debug) {
          try { console.debug("[IDBCache] set", { src: context.src }); } catch {}
        }
      },
      onSrcChange: (context: PluginContext, oldSrc: string) => {
        // 迁移期间回收旧 objectURL
        const old = createdObjectURLs.get(oldSrc);
        if (old) {
          try { URL.revokeObjectURL(old); } catch {}
          createdObjectURLs.delete(oldSrc);
        }
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