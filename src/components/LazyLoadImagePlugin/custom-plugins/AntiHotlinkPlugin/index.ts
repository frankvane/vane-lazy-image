import type { LazyImagePlugin } from "../../plugins/types";

export interface AntiHotlinkPluginConfig {
  allowedDomains?: string[];
  checkReferer?: boolean; // 仅在浏览器环境有效
  generateToken?: (src: string) => string | undefined;
  tokenParam?: string; // 例如 "token"
}

function hostnameOf(url: string): string | null {
  try {
    const u = new URL(url, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    return u.hostname;
  } catch {
    return null;
  }
}

function appendParam(src: string, key: string, value: string): string {
  try {
    const u = new URL(src, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    u.searchParams.set(key, value);
    return u.toString();
  } catch {
    const sep = src.includes("?") ? "&" : "?";
    return `${src}${sep}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  }
}

export function createAntiHotlinkPlugin(
  config: AntiHotlinkPluginConfig = {}
): LazyImagePlugin {
  const { allowedDomains, checkReferer = false, generateToken, tokenParam = "token" } = config;

  return {
    name: "anti-hotlink",
    version: "1.0.0",
    config,
    hooks: {
      transformProps: (props) => {
        // 域名白名单：仅当图片域名在白名单时才注入 token
        if (Array.isArray(allowedDomains) && allowedDomains.length > 0) {
          const host = hostnameOf(props.src);
          if (!host || !allowedDomains.includes(host)) return props;
        }

        // 可选：基于 referer 的简单校验（前端无法真正阻止，但可用于标记）
        if (checkReferer && typeof document !== "undefined") {
          const referer = (document as any).referrer as string | undefined;
          // 如果无 referrer，可视为潜在直链，仍然允许但可注入标记参数
          if (!referer) {
            const nextSrc = appendParam(props.src, "ref", "direct");
            return { ...props, src: nextSrc };
          }
        }

        // 注入动态签名/Token
        const token = generateToken?.(props.src);
        if (!token) return props;
        const nextSrc = appendParam(props.src, tokenParam, token);
        return { ...props, src: nextSrc };
      },
    },
  };
}