import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface WebPPluginConfig {
  enabled?: boolean;
  /** 自定义重写函数：返回 webp 链接 */
  rewrite?: (src: string, ctx: PluginContext) => string | undefined;
  /** 需要替换为 .webp 的扩展名 */
  replaceExtensions?: string[];
  /** 追加的查询参数，例如 "format=webp" */
  appendQueryParam?: string;
  /** 限定域名（空则不限制） */
  onDomains?: string[];
  /** 在运行前检测浏览器是否支持 webp */
  testSupport?: boolean;
}

let webpSupportPromise: Promise<boolean> | null = null;
function detectWebPSupport(): Promise<boolean> {
  if (webpSupportPromise) return webpSupportPromise;
  // 2x1 的极小 webp 测试图片（base64）
  const dataUrl =
    "data:image/webp;base64,UklGRiIAAABXRUJQVlA4ICAAAADwAQCdASoBAAEALm0AAA/vv///8AA";
  webpSupportPromise = new Promise<boolean>((resolve) => {
    try {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = dataUrl;
    } catch {
      resolve(false);
    }
  });
  return webpSupportPromise;
}

function shouldRewriteForDomain(url: string, domains?: string[]): boolean {
  if (!domains || domains.length === 0) return true;
  try {
    const u = new URL(url);
    return domains.some((d) => u.hostname.includes(d));
  } catch {
    return false;
  }
}

function appendQuery(url: string, param?: string): string {
  if (!param) return url;
  try {
    const u = new URL(url);
    const [key, value] = param.split("=");
    if (key) u.searchParams.set(key, value ?? "");
    return u.toString();
  } catch {
    // 退化处理：简单拼接
    return url.includes("?") ? `${url}&${param}` : `${url}?${param}`;
  }
}

function replaceExtToWebP(url: string, exts: string[]): string {
  const idx = url.lastIndexOf(".");
  if (idx < 0) return url;
  const ext = url.substring(idx + 1).toLowerCase();
  if (!exts.includes(ext)) return url;
  return `${url.substring(0, idx)}.webp`;
}

export function createWebPPlugin(config: WebPPluginConfig = {}): LazyImagePlugin {
  const {
    enabled = true,
    rewrite,
    replaceExtensions = ["jpg", "jpeg", "png"],
    appendQueryParam,
    onDomains,
    testSupport = true,
  } = config;

  return {
    name: "webp",
    version: "1.0.0",
    config,
    hooks: {
      onLoad: async (context: PluginContext) => {
        if (!enabled) return undefined;
        const original = context.src;
        if (!shouldRewriteForDomain(original, onDomains)) return undefined;

        // 检测支持性
        if (testSupport) {
          const supported = await detectWebPSupport();
          if (!supported) return undefined;
        }

        // 生成 webp 链接
        let candidate: string | undefined = undefined;
        if (rewrite) {
          candidate = rewrite(original, context);
        } else {
          const replaced = replaceExtToWebP(original, replaceExtensions);
          candidate = appendQuery(replaced, appendQueryParam);
        }

        if (!candidate || candidate === original) return undefined;
        // 记录以便错误时回退
        try {
          context.sharedData?.set("webp:original", original);
          context.sharedData?.set("webp:rewritten", candidate);
        } catch {}
        return candidate;
      },

      onLoadError: (context: PluginContext) => {
        // 如果是 webp 链接失败，回退到原始链接
        const orig = context.sharedData?.get("webp:original");
        const rewritten = context.sharedData?.get("webp:rewritten");
        const img = context.imageRef?.current;
        if (img && orig && rewritten && img.src === rewritten) {
          try {
            img.src = orig;
          } catch {}
          // 返回 true 以表明已处理错误（核心仍会更新状态，但成功后会恢复）
          return true;
        }
        return false;
      },
    },
  };
}