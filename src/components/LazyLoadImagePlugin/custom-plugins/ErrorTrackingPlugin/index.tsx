import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface ErrorTrackingConfig {
  reportEndpoint?: string;
  report?: (payload: any) => void;
  showBadge?: boolean;
  badgeText?: string;
  badgeColor?: string;
  badgeBg?: string;
}

function tryReport(cfg: ErrorTrackingConfig, payload: any) {
  try {
    if (cfg.report) cfg.report(payload);
    if (cfg.reportEndpoint) {
      fetch(cfg.reportEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {}
}

export function createErrorTrackingPlugin(config: ErrorTrackingConfig = {}): LazyImagePlugin {
  return {
    name: "error-tracking",
    version: "1.0.0",
    config,
    hooks: {
      onLoadError: (context: PluginContext, error: Error) => {
        const key = "error-count";
        const prev = Number(context.sharedData?.get(key) ?? 0);
        const next = prev + 1;
        context.sharedData?.set(key, next);
        const payload = {
          src: context.src,
          message: String(error?.message || "unknown"),
          stack: (error as any)?.stack,
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