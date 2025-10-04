import React from "react";
import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface SkeletonPluginConfig {
  type?: "shimmer" | "pulse";
  backgroundColor?: string;
  highlightColor?: string; // shimmer 高亮色
  borderRadius?: number;
  zIndex?: number;
  showWhen?: "always" | "loading";
}

function SkeletonOverlay({
  imageState,
  type = "shimmer",
  backgroundColor = "#e5e7eb",
  highlightColor = "#f3f4f6",
  borderRadius = 4,
  zIndex = 2,
  showWhen = "loading",
}: {
  imageState: PluginContext["imageState"];
  type?: SkeletonPluginConfig["type"];
  backgroundColor?: string;
  highlightColor?: string;
  borderRadius?: number;
  zIndex?: number;
  showWhen?: SkeletonPluginConfig["showWhen"];
}) {
  const visible = showWhen === "always" ? true : imageState.isLoading;
  if (!visible) return null;

  const base: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius,
    overflow: "hidden",
    pointerEvents: "none",
    zIndex,
  };

  const shimmerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    backgroundImage: `linear-gradient(90deg, ${backgroundColor} 0%, ${backgroundColor} 35%, ${highlightColor} 50%, ${backgroundColor} 65%, ${backgroundColor} 100%)`,
    backgroundSize: "200% 100%",
    animation: "lli-skeleton-shimmer 1200ms ease-in-out infinite",
  };

  const pulseStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    background: backgroundColor,
    animation: "lli-skeleton-pulse 1200ms ease-in-out infinite",
  };

  return (
    <div style={base}>
      {/* 注入一次性样式（局部作用域） */}
      <style>
        {`
@keyframes lli-skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes lli-skeleton-pulse {
  0%, 100% { opacity: 0.85; }
  50% { opacity: 0.6; }
}
        `}
      </style>
      <div style={type === "shimmer" ? shimmerStyle : pulseStyle} />
    </div>
  );
}

export function createSkeletonPlugin(config: SkeletonPluginConfig = {}): LazyImagePlugin {
  return {
    name: "skeleton",
    version: "1.0.0",
    config,
    hooks: {
      renderOverlay: (context) => (
        <SkeletonOverlay
          imageState={context.imageState}
          type={config.type}
          backgroundColor={config.backgroundColor}
          highlightColor={config.highlightColor}
          borderRadius={config.borderRadius}
          zIndex={config.zIndex}
          showWhen={config.showWhen}
        />
      ),
    },
  };
}