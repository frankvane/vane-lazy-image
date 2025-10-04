import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

import React from "react";

export interface ViewportAwareConfig {
  showDot?: boolean;
  dotPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** 是否在不在视口时隐藏指示点（默认显示为灰色） */
  hideWhenOut?: boolean;
}

function Dot({ context, cfg }: { context: PluginContext; cfg: ViewportAwareConfig }) {
  if (!cfg.showDot) return null;
  if (cfg.hideWhenOut && !context.isIntersecting) return null;
  const pos = cfg.dotPosition ?? "bottom-right";
  const style: React.CSSProperties = {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 999,
    background: context.isIntersecting ? "#28a745" : "#6c757d",
    zIndex: 10,
  };
  if (pos.includes("top")) style.top = 6; else style.bottom = 6;
  if (pos.includes("left")) style.left = 6; else style.right = 6;
  return <div style={style} title={context.isIntersecting ? "in-view" : "out-of-view"} />;
}

export function createViewportAwarePlugin(config: ViewportAwareConfig = {}): LazyImagePlugin {
  return {
    name: "viewport-aware",
    version: "1.0.0",
    config,
    hooks: {
      renderOverlay: (context) => <Dot context={context} cfg={config} />,
      onEnterViewport: (context) => {
        // 可在进入视口时提升加载策略
        try { (context.imageRef?.current as any)?.setAttribute("data-in-view", "1"); } catch {}
      },
      onLeaveViewport: (context) => {
        try { (context.imageRef?.current as any)?.setAttribute("data-in-view", "0"); } catch {}
      },
    },
  };
}