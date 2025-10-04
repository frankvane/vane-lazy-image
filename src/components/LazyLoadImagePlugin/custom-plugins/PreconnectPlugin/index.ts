import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface PreconnectPluginConfig {
  domains?: string[]; // 额外预连接域名
  crossOrigin?: string | null; // "anonymous" | "use-credentials" | null
}

function addPreconnect(origin: string, crossOrigin: string | null = "anonymous") {
  if (typeof document === "undefined") return;
  const id = `lli-preconnect-${origin}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "preconnect";
  link.href = origin;
  if (crossOrigin) link.crossOrigin = crossOrigin as any;
  document.head.appendChild(link);
}

function removePreconnect(origin: string) {
  if (typeof document === "undefined") return;
  const id = `lli-preconnect-${origin}`;
  const el = document.getElementById(id);
  if (el) el.remove();
}

function getOrigin(src: string): string | null {
  try {
    const u = new URL(src, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

export function createPreconnectPlugin(config: PreconnectPluginConfig = {}): LazyImagePlugin {
  return {
    name: "preconnect",
    version: "1.0.0",
    config,
    hooks: {
      onMount: (context: PluginContext) => {
        const origin = getOrigin(context.src);
        if (origin) addPreconnect(origin, config.crossOrigin ?? "anonymous");
        if (config.domains && Array.isArray(config.domains)) {
          config.domains.forEach((d) => addPreconnect(d, config.crossOrigin ?? "anonymous"));
        }
      },
      onUnmount: (context: PluginContext) => {
        const origin = getOrigin(context.src);
        if (origin) removePreconnect(origin);
        if (config.domains && Array.isArray(config.domains)) {
          config.domains.forEach((d) => removePreconnect(d));
        }
      },
      onSrcChange: (context: PluginContext, _old, next) => {
        const origin = getOrigin(next);
        if (origin) addPreconnect(origin, config.crossOrigin ?? "anonymous");
      },
    },
  };
}