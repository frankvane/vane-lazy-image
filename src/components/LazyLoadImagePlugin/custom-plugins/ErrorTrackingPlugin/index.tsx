import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface ErrorTrackingConfig {
  reportEndpoint?: string;
  report?: (payload: any) => void;
  showBadge?: boolean;
  badgeText?: string;
  badgeColor?: string;
  badgeBg?: string;
}

// ⭐ 添加报告防抖机制，避免高频错误导致大量请求
const lastReportTime = new Map<string, number>();
const DEBOUNCE_TIME = 1000; // 1秒防抖（错误报告可以稍长）

function tryReport(cfg: ErrorTrackingConfig, payload: any) {
  // ⭐ 防抖：同一src的错误在1秒内只报告一次
  const key = payload.src || '';
  const now = Date.now();
  const last = lastReportTime.get(key) || 0;

  if (now - last < DEBOUNCE_TIME) {
    return; // 跳过重复报告
  }

  lastReportTime.set(key, now);

  try {
    if (cfg.report) cfg.report(payload);
    if (cfg.reportEndpoint) {
      // ⭐ 添加超时控制
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      fetch(cfg.reportEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
        signal: controller.signal,
      }).catch(() => {
        // 忽略上报失败
      }).finally(() => {
        clearTimeout(timeout);
      });
    }
  } catch {}

  // 定期清理旧记录
  setTimeout(() => {
    lastReportTime.delete(key);
  }, 5000);
}

export function createErrorTrackingPlugin(config: ErrorTrackingConfig = {}): LazyImagePlugin {
  return {
    name: "error-tracking",
    version: "1.0.0",
    config,
    hooks: {
      onLoadError: (context: PluginContext, error: Error | Event) => {
        const key = "error-count";
        const prev = Number(context.sharedData?.get(key) ?? 0);
        const next = prev + 1;
        context.sharedData?.set(key, next);
        const payload = {
          src: context.src,
          message: error instanceof Error ? error.message : String(error || "unknown"),
          stack: error instanceof Error ? error.stack : undefined,
          time: Date.now(),
          network: context.networkInfo,
          device: context.deviceInfo,
          count: next,
        };
        tryReport(config, payload);
        // 标记发生错误，便于其他插件联动
        try { context.sharedData?.set("had-error", true); } catch {}
        return true;
      },
      renderOverlay: (context: PluginContext) => {
        if (!config.showBadge) return null;
        const count = Number(context.sharedData?.get("error-count") ?? 0);
        if (count <= 0) return null;
        const base: React.CSSProperties = {
          position: "absolute",
          top: 6,
          right: 6,
          zIndex: 10,
          fontSize: 12,
          color: config.badgeColor ?? "#fff",
          background: config.badgeBg ?? "rgba(220,53,69,0.8)",
          padding: "2px 6px",
          borderRadius: 4,
        };
        return (
          <div style={base}>
            {config.badgeText ?? "Error"} × {count}
          </div>
        );
      },
    },
  };
}