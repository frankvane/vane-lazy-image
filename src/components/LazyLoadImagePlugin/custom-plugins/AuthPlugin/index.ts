import type { LazyImagePlugin } from "../../plugins/types";
import type React from "react";

export interface AuthPluginConfig {
  token?: string | (() => string | undefined);
  tokenParam?: string; // 添加到查询参数的键
  crossOrigin?: "anonymous" | "use-credentials";
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

function appendQuery(u: URL, key: string, val: string) {
  try {
    if (!u.searchParams.get(key)) {
      u.searchParams.set(key, val);
    }
  } catch {}
}

export function createAuthPlugin(config: AuthPluginConfig = {}): LazyImagePlugin {
  return {
    name: "auth",
    version: "1.0.0",
    config,
    hooks: {
      transformProps: (props) => {
        let p = { ...props };
        try {
          const token = typeof config.token === "function" ? config.token() : config.token;
          if (token) {
            const u = new URL(p.src, typeof window !== "undefined" ? window.location.origin : "http://localhost");
            appendQuery(u, config.tokenParam ?? "token", token);
            p.src = u.toString();
          }
          if (config.crossOrigin) {
            (p as any).crossOrigin = config.crossOrigin;
          }
          if (config.referrerPolicy) {
            (p as any).referrerPolicy = config.referrerPolicy;
          }
        } catch {}
        return p;
      },
    },
  };
}