import React from "react";
import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface BadgePluginConfig {
  text?: string | ((context: PluginContext) => string);
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  bgColor?: string;
  color?: string;
  fontSize?: number;
  padding?: string;
  borderRadius?: number;
  zIndex?: number;
  showWhen?: "always" | "loading" | "loaded" | "error";
  enabled?: boolean;
}

export function createBadgePlugin(config: BadgePluginConfig = {}): LazyImagePlugin {
  const {
    text = "Badge",
    position = "top-left",
    bgColor = "rgba(0,0,0,0.6)",
    color = "#fff",
    fontSize = 12,
    padding = "2px 6px",
    borderRadius = 4,
    zIndex = 3,
    showWhen = "loaded",
    enabled = true,
  } = config;

  const plugin: LazyImagePlugin = {
    name: "badge",
    version: "1.0.0",
    config,
    hooks: {
      render: (context: PluginContext) => {
        if (!enabled) return null;

        const { imageState } = context;
        const shouldShow =
          showWhen === "always" ||
          (showWhen === "loading" && imageState.isLoading) ||
          (showWhen === "loaded" && imageState.isLoaded) ||
          (showWhen === "error" && imageState.isError);

        if (!shouldShow) return null;

        const label = typeof text === "function" ? text(context) : text;

        const baseStyle: React.CSSProperties = {
          position: "absolute",
          pointerEvents: "none",
          background: bgColor,
          color,
          fontSize,
          padding,
          borderRadius,
          zIndex,
          lineHeight: 1.2,
          fontWeight: 500,
        };

        const posStyle: Record<string, React.CSSProperties> = {
          "top-left": { top: 8, left: 8 },
          "top-right": { top: 8, right: 8 },
          "bottom-left": { bottom: 8, left: 8 },
          "bottom-right": { bottom: 8, right: 8 },
          center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
        };

        return <div style={{ ...baseStyle, ...posStyle[position] }}>{label}</div>;
      },
    },
  };

  return plugin;
}