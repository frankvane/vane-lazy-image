import type { LazyImagePlugin } from "../../plugins/types";

export interface AltTextPluginConfig {
  derive?: (src: string) => string;
  prefix?: string; // 例如 "Image"
}

function defaultDerive(src: string, prefix = "Image"): string {
  try {
    const u = new URL(src, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    const path = u.pathname.replace(/\/+$/, "");
    return `${prefix} • ${path}`;
  } catch {
    return prefix;
  }
}

export function createAltTextPlugin(config: AltTextPluginConfig = {}): LazyImagePlugin {
  return {
    name: "alt-text",
    version: "1.0.0",
    config,
    hooks: {
      transformProps: (props) => {
        const alt = props.alt;
        if (typeof alt === "string" && alt.trim().length > 0) return props;
        const derived = config.derive ? config.derive(props.src) : defaultDerive(props.src, config.prefix ?? "Image");
        return { ...props, alt: derived };
      },
    },
  };
}