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
  cfg: Required<
    Pick<IDBCacheConfig, "dbName" | "storeName" | "ttlMs" | "debug">
  >
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
      try {
        console.warn("[IDBCache] get failed", e);
      } catch {}
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
      try {
        console.warn("[IDBCache] set failed", e);
      } catch {}
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

export function createIDBCachePlugin(
  config: IDBCacheConfig = {}
): LazyImagePlugin {
  const {
    enabled = true,
    dbName = "LLI-Cache",
    storeName = "images",
    ttlMs = 7 * 24 * 60 * 60 * 1000, // 默认 7 天
    debug = false,
  } = config;

// 记录由缓存创建的 objectURL，以便在卸载时回收
  const createdObjectURLs = new Map<string, string>();

  // ⭐ 添加状态追踪，防止重入和重复操作
  const processingKeys = new Set<string>();
  const writingKeys = new Set<string>();
  // 🔥 添加全局 fetch 追踪，防止循环 fetch
  const fetchingKeys = new Set<string>();

  return {
    name: "cache-idb",
    version: "1.0.0",
    config,
    hooks: {
      onLoad: async (context: PluginContext) => {
        if (!enabled) return undefined;

        // ⭐ 防止重入：如果正在处理同一个 src，立即返回
        if (processingKeys.has(context.src)) {
          if (debug) {
            try {
              console.warn("[IDBCache] Prevented reentry for", context.src);
            } catch {}
          }
          return undefined;
        }

        processingKeys.add(context.src);
        try {
          const raw = await idbGetRaw(context.src, {
            dbName,
            storeName,
            ttlMs,
            debug,
          });
          if (raw) {
            if (debug) {
              try {
                console.debug("[IDBCache] hit", { src: context.src });
              } catch {}
            }
            context.bus?.emit("cache:hit", { level: "idb", src: context.src });
            if (raw.blob) {
              // 🚀 P1-3 优化：避免重复创建 ObjectURL
              // 先检查 sharedData 中是否已有 objectURL
              let url = context.sharedData?.get("fetch-loader:object-url") as
                | string
                | undefined;

              if (!url) {
                // 首次创建 objectURL
                url = URL.createObjectURL(raw.blob);
                createdObjectURLs.set(context.src, url);
                // 将 objectURL 和 blob 存入 sharedData 供其他插件复用
                try {
                  context.sharedData?.set("fetch-loader:object-url", url);
                  context.sharedData?.set("fetch-loader:blob", raw.blob);
                } catch {}
              }
              return url; // 返回对象 URL
            }
            // fallback: 返回字符串（dataURL 或原始 URL）
            return raw.value;
          }
          return undefined;
        } finally {
          // ⭐ 确保在任何情况下都清理状态
          processingKeys.delete(context.src);
        }
      },
      onLoadSuccess: async (context: PluginContext, displaySrc: string) => {
        if (!enabled) return;

        // ⭐ 防止重复写入：如果正在写入同一个 src，跳过
        if (writingKeys.has(context.src)) {
          if (debug) {
            try {
              console.warn("[IDBCache] Write already in progress for", context.src);
            } catch {}
          }
          return;
        }

        writingKeys.add(context.src);
        try {
          // ⭐⭐ 关键修复：优先从 sharedData 获取 blob，然后尝试从 context.src 获取
          let blob = context.sharedData?.get("fetch-loader:blob") as Blob | undefined;

          // 🔥 核心修复：如果 sharedData 中没有 blob，主动从原始 URL fetch
          if (!blob && !fetchingKeys.has(context.src)) {
            if (debug) {
              try {
                console.debug("[IDBCache] No blob in sharedData, fetching from source:", context.src);
              } catch {}
            }

            // 🔥 关键保护：标记正在 fetch，防止循环
            fetchingKeys.add(context.src);
            try {
              const controller = new AbortController();
              const timeout = setTimeout(() => controller.abort(), 5000);

              // 🔥 关键：直接从原始 src fetch，而不是从 displaySrc
              const res = await fetch(context.src, {
                cache: "force-cache",
                signal: controller.signal
              });
              clearTimeout(timeout);

              if (res.ok) {
                blob = await res.blob();
                if (debug) {
                  try {
                    console.debug("[IDBCache] ✅ Fetched blob from source:", {
                      src: context.src,
                      size: blob.size,
                      type: blob.type
                    });
                  } catch {}
                }
              }
            } catch (err: any) {
              if (debug && err?.name !== 'AbortError') {
                try {
                  console.warn("[IDBCache] ⚠️ Fetch from source failed:", err);
                } catch {}
              }
            } finally {
              // 🔥 确保清理 fetching 状态
              fetchingKeys.delete(context.src);
            }
          } else if (fetchingKeys.has(context.src)) {
            if (debug) {
              try {
                console.warn("[IDBCache] ⚠️ Fetch already in progress, skipping:", context.src);
              } catch {}
            }
          }

          // 🔥 如果获取到 blob（无论从哪个来源），都存储 blob
          if (blob) {
            await idbSet(context.src, blob, { dbName, storeName, debug });
            if (debug) {
              try {
                console.debug("[IDBCache] ✅ Stored blob successfully:", {
                  src: context.src,
                  size: blob.size,
                  type: blob.type
                });
              } catch {}
            }
          } else {
            // 🔥 降级方案：存储字符串（但这不是理想情况）
            if (displaySrc.startsWith("data:")) {
              // 尝试将 dataURL 转换为 blob
              const blobFromDataURL = dataURLToBlob(displaySrc);
              if (blobFromDataURL) {
                await idbSet(context.src, blobFromDataURL, { dbName, storeName, debug });
                if (debug) {
                  try {
                    console.debug("[IDBCache] ✅ Stored blob from dataURL");
                  } catch {}
                }
              } else {
                await idbSet(context.src, displaySrc, { dbName, storeName, debug });
                if (debug) {
                  try {
                    console.warn("[IDBCache] ⚠️ Stored dataURL as string (not ideal)");
                  } catch {}
                }
              }
            } else {
              // 存储 URL（最坏情况，下次还需要请求）
              await idbSet(context.src, displaySrc, { dbName, storeName, debug });
              if (debug) {
                try {
                  console.warn("[IDBCache] ⚠️ Stored URL only, no blob available:", {
                    src: context.src,
                    displaySrc
                  });
                } catch {}
              }
            }
          }
        } catch {
          // 忽略写入错误
        } finally {
          // ⭐ 确保清理写入状态
          writingKeys.delete(context.src);
        }

        if (debug) {
          try {
            console.debug("[IDBCache] set", { src: context.src });
          } catch {}
        }
      },
      onSrcChange: (context: PluginContext, oldSrc: string) => {
        // 迁移期间回收旧 objectURL
        const old = createdObjectURLs.get(oldSrc);
        if (old) {
          try {
            URL.revokeObjectURL(old);
          } catch {}
          createdObjectURLs.delete(oldSrc);
        }
      },
      onUnmount: (context: PluginContext) => {
        const url = createdObjectURLs.get(context.src);
        if (url) {
          try {
            URL.revokeObjectURL(url);
          } catch {}
          createdObjectURLs.delete(context.src);
        }
      },
    },
  };
}
