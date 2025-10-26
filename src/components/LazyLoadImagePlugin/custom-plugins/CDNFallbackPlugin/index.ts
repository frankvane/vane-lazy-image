import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface CDNFallbackConfig {
  cdnBases: string[]; // e.g. ["https://cdn1.example.com", "https://cdn2.example.com"]
}

function swapBase(originalSrc: string, base: string): string {
  try {
    const u = new URL(originalSrc, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    const newBase = new URL(base);
    u.protocol = newBase.protocol;
    u.hostname = newBase.hostname;
    u.port = newBase.port;
    return u.toString();
  } catch {
    return originalSrc;
  }
}

export function createCDNFallbackPlugin(config: CDNFallbackConfig): LazyImagePlugin {
  const bases = config.cdnBases || [];
  return {
    name: "cdn-fallback",
    version: "1.0.0",
    config,
    hooks: {
      transformProps: (props) => {
        if (!bases.length) return props;
        const p = { ...props };
        try {
          const idx = Number((p as any)._sharedData?.get("cdn-index") ?? 0);
        } catch {}
        return p;
      },
      onLoadError: (context: PluginContext) => {
        if (!bases.length) return true;
        const key = "cdn-index";
        const prev = Number(context.sharedData?.get(key) ?? 0);
        const next = (prev + 1) % bases.length;
        context.sharedData?.set(key, next);
        // 直接切换 <img> 的 src 以触发重试
        const img = context.imageRef?.current;
        if (img) {
          const altSrc = swapBase(context.src, bases[next]);
          try { img.src = `${altSrc}${altSrc.includes("?") ? "&" : "?"}cdnFallback=${Date.now()}`; } catch {}
        }
        return true;
      },
      onLoad: (context: PluginContext) => {
        if (!bases.length) return undefined;
        const idx = Number(context.sharedData?.get("cdn-index") ?? 0);
        const candidate = swapBase(context.src, bases[idx]);
        return candidate;
      },
    },
  };
}