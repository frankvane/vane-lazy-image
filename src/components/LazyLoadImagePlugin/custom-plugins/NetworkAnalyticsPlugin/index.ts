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

// ⭐ 添加事件去重和防抖机制
const emittedEvents = new Map<string, number>();
const DEBOUNCE_TIME = 100; // 100ms 防抖时间

function emit(config: NetworkAnalyticsPluginConfig, event: string, data: Record<string, any>) {
  // ⭐ 事件去重：同一事件+src 短时间内只触发一次
  const key = `${event}:${data.src || ''}`;
  const now = Date.now();
  const lastTime = emittedEvents.get(key) || 0;

  if (now - lastTime < DEBOUNCE_TIME) {
    return; // 防抖：跳过重复事件
  }

  emittedEvents.set(key, now);

  // 定期清理旧记录（1秒后）
  setTimeout(() => {
    emittedEvents.delete(key);
  }, 1000);

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
      onLoadError: (context: PluginContext, error: Error | Event) => {
        const host = config.trackCDN ? getHostname(context.src) : null;
        const message = error instanceof Error ? error.message : String(error || "unknown");
        emit(config, "load-error", { src: context.src, message, host, time: Date.now() });
        return false;
      },
      onUnmount: (context: PluginContext) => {
        emit(config, "unmount", { src: context.src, time: Date.now() });
      },
    },
  };
}