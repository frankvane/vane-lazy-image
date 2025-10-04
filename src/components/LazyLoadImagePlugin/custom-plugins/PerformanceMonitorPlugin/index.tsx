import React from "react";
import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface PerformanceMonitorConfig {
  showOverlay?: boolean;
  overlayPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color?: string;
  background?: string;
  onReport?: (data: {
    src: string;
    durationMs: number;
    network?: PluginContext["networkInfo"];
    device?: PluginContext["deviceInfo"];
  }) => void;
}

function Overlay({ context, cfg }: { context: PluginContext; cfg: PerformanceMonitorConfig }) {
  const pd = context.performanceData || { duration: undefined };
  if (!cfg.showOverlay) return null;
  if (!context.imageState.isLoaded) return null;

  const pos = cfg.overlayPosition ?? "top-right";
  const base: React.CSSProperties = {
    position: "absolute",
    zIndex: 9,
    background: cfg.background ?? "rgba(0,0,0,0.45)",
    color: cfg.color ?? "#fff",
    fontSize: 12,
    padding: "2px 6px",
    borderRadius: 4,
  };
  if (pos.includes("top")) base.top = 6;
  if (pos.includes("bottom")) base.bottom = 6;
  if (pos.includes("left")) base.left = 6;
  if (pos.includes("right")) base.right = 6;

  return <div style={base}>Loaded in {Math.round((pd.duration || 0))} ms</div>;
}

export function createPerformanceMonitorPlugin(config: PerformanceMonitorConfig = {}): LazyImagePlugin {
  return {
    name: "performance-monitor",
    version: "1.0.0",
    config,
    hooks: {
      onLoadSuccess: (context) => {
        const pd = context.performanceData || { duration: 0 };
        const payload = {
          src: context.src,
          durationMs: Math.round(pd.duration || 0),
          network: context.networkInfo,
          device: context.deviceInfo,
        };
        try {
          config.onReport && config.onReport(payload);
        } catch {}
      },
      renderOverlay: (context) => <Overlay context={context} cfg={config} />,
    },
  };
}