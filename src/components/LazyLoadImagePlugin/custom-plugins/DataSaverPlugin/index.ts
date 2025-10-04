import type { LazyImagePlugin } from "../../plugins/types";

export interface DataSaverPluginConfig {
  respectSaveData?: boolean;
  fallbackQuality?: number; // 0..1
  disablePreload?: boolean;
  qualityParam?: string; // query param name, e.g. "quality" or "q"
}

function appendQuery(src: string, key: string, value: string): string {
  try {
    const u = new URL(
      src,
      typeof window !== "undefined" ? window.location.origin : "http://localhost"
    );
    u.searchParams.set(key, value);
    return u.toString();
  } catch {
    const sep = src.includes("?") ? "&" : "?";
    return `${src}${sep}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  }
}

export function createDataSaverPlugin(
  config: DataSaverPluginConfig = {}
): LazyImagePlugin {
  const {
    respectSaveData = true,
    fallbackQuality = 0.6,
    disablePreload = true,
    qualityParam = "quality",
  } = config;

  return {
    name: "data-saver",
    version: "1.0.0",
    config,
    hooks: {
      transformProps: (props) => {
        try {
          const saveData = (navigator as any)?.connection?.saveData === true;
          if (!respectSaveData || !saveData) return props;
          const q = Math.max(0, Math.min(1, fallbackQuality));
          const nextSrc = appendQuery(props.src, qualityParam, String(q));
          const next: typeof props = { ...props, src: nextSrc };
          // 优先使用懒加载策略以减少数据使用
          if (disablePreload) {
            next.loading = "lazy";
          }
          return next;
        } catch {
          return props;
        }
      },
    },
  };
}