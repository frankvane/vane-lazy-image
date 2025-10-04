import type { LazyImagePlugin } from "../../plugins/types";

export interface ImageOptimizationPluginConfig {
  enabled?: boolean;
  maxWidth?: number; // 最大宽度（像素）
  quality?: number; // 0..1
  format?: "auto" | "webp" | "jpg" | "png";
  widthParam?: string; // 例如 "w"
  qualityParam?: string; // 例如 "q"
  formatParam?: string; // 例如 "format"
}

function appendParams(src: string, params: Record<string, string | number | undefined>): string {
  try {
    const u = new URL(
      src,
      typeof window !== "undefined" ? window.location.origin : "http://localhost"
    );
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) u.searchParams.set(k, String(v));
    });
    return u.toString();
  } catch {
    const keys = Object.keys(params).filter((k) => params[k] !== undefined && params[k] !== null);
    if (keys.length === 0) return src;
    const sep = src.includes("?") ? "&" : "?";
    const query = keys
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(String(params[k]!))}`)
      .join("&");
    return `${src}${sep}${query}`;
  }
}

export function createImageOptimizationPlugin(
  config: ImageOptimizationPluginConfig = {}
): LazyImagePlugin {
  const {
    enabled = true,
    maxWidth = 1920,
    quality = 0.85,
    format = "auto",
    widthParam = "w",
    qualityParam = "q",
    formatParam = "format",
  } = config;

  return {
    name: "image-optimization",
    version: "1.0.0",
    config,
    hooks: {
      transformProps: (props) => {
        if (!enabled) return props;
        try {
          const dpr = typeof window !== "undefined" ? Math.max(1, window.devicePixelRatio || 1) : 1;
          const viewportWidth = typeof window !== "undefined" ? window.innerWidth || maxWidth : maxWidth;
          const targetWidth = Math.min(Math.round(viewportWidth * dpr), maxWidth);
          const nextSrc = appendParams(props.src, {
            [widthParam]: targetWidth,
            [qualityParam]: Math.max(0, Math.min(1, quality)),
            [formatParam]: format,
          });
          return { ...props, src: nextSrc };
        } catch {
          return props;
        }
      },
    },
  };
}