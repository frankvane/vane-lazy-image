import React from "react";
import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface WatermarkPluginConfig {
  text?: string | ((src: string) => string);
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  opacity?: number; // 0~1
  fontSize?: number; // px
  color?: string;
  offsetX?: number; // px
  offsetY?: number; // px
  zIndex?: number;
  enabled?: boolean;
}

export function createWatermarkPlugin(
  config: WatermarkPluginConfig = {}
): LazyImagePlugin {
  const {
    text = "© 2024 Vane",
    position = "bottom-right",
    opacity = 0.8,
    fontSize = 12,
    color = "#fff",
    offsetX = 8,
    offsetY = 8,
    zIndex = 2,
    enabled = true,
  } = config;

  const plugin: LazyImagePlugin = {
    name: "watermark",
    version: "1.0.0",
    config,
    hooks: {
      render: (context: PluginContext) => {
        if (!enabled) return null;

        const label = typeof text === "function" ? text(context.src) : text;

        const baseStyle: React.CSSProperties = {
          position: "absolute",
          pointerEvents: "none",
          color,
          opacity,
          fontSize,
          fontWeight: 500,
          textShadow: "0 1px 2px rgba(255,255,255,0.5)",
          zIndex,
        };

        const posStyle: Record<string, React.CSSProperties> = {
          "top-left": { top: offsetY, left: offsetX },
          "top-right": { top: offsetY, right: offsetX },
          "bottom-left": { bottom: offsetY, left: offsetX },
          "bottom-right": { bottom: offsetY, right: offsetX },
          center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
        };

        return (
          <div style={{ ...baseStyle, ...posStyle[position] }}>{label}</div>
        );
      },
    },
  };

  return plugin;
}