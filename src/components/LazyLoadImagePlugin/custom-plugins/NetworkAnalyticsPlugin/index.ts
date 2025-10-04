import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface NetworkAnalyticsPluginConfig {
  reportEndpoint?: string;
  /** 自定义上报函数（若提供则优先使用） */
  report?: (event: string, data: Record<string, any>) => void;
  trackCDN?: boolean;
}

function getHostname(src: string): string | null {
  try {
    const u = new URL(src, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    return u.hostname;
  } catch {
    return null;
  }
}

async function defaultReport(endpoint: string, payload: Record<string, any>) {
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // 忽略上报错误
  }
}

function emit(config: NetworkAnalyticsPluginConfig, event: string, data: Record<string, any>) {
  if (typeof config.report === "function") {
    try { config.report(event, data); } catch {}
  } else if (config.reportEndpoint) {
    void defaultReport(config.reportEndpoint, { event, ...data });
  } else {
    // eslint-disable-next-line no-console
    try { console.debug("[LLI][net]", event, data); } catch {}
  }
}

export function createNetworkAnalyticsPlugin(
  config: NetworkAnalyticsPluginConfig = {}
): LazyImagePlugin {
  return {
    name: "network-analytics",
    version: "1.0.0",
    config,
    hooks: {
      onMount: (context: PluginContext) => {
        emit(config, "mount", { src: context.src, time: Date.now() });
      },
      onLoadSuccess: (context: PluginContext, displaySrc?: string) => {
        const host = config.trackCDN ? getHostname(context.src) : null;
        emit(config, "load-success", { src: context.src, displaySrc, host, time: Date.now() });
      },
      onLoadError: (context: PluginContext, error: Error) => {
        const host = config.trackCDN ? getHostname(context.src) : null;
        emit(config, "load-error", { src: context.src, message: error.message, host, time: Date.now() });
        return false;
      },
      onUnmount: (context: PluginContext) => {
        emit(config, "unmount", { src: context.src, time: Date.now() });
      },
    },
  };
}