import React from "react";
import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface CropPluginConfig {
  enabled?: boolean;
  focusPoint?: { x: number; y: number }; // 0~1 相对坐标
}

export function createCropPlugin(config: CropPluginConfig = {}): LazyImagePlugin {
  const { enabled = true, focusPoint = { x: 0.5, y: 0.5 } } = config;
  return {
    name: "crop",
    version: "0.1.0",
    config,
    hooks: {
      transformProps: (props) => {
        if (!enabled) return props;
        // 最小实现：通过 objectPosition 模拟裁剪焦点
        const imageStyle = {
          ...(props.imageStyle || {}),
          objectFit: "cover",
          objectPosition: `${Math.round(focusPoint.x * 100)}% ${Math.round(focusPoint.y * 100)}%`,
        } as React.CSSProperties;
        return { ...props, imageStyle };
      },
      renderOverlay: (context: PluginContext) => {
        if (!enabled) return null;
        return (
          <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(255,165,0,0.8)", color: "#000", padding: "4px 6px", borderRadius: 4, fontSize: 12 }}>
            CropPlugin · focus {focusPoint.x.toFixed(2)},{focusPoint.y.toFixed(2)}
          </div>
        );
      },
    },
  };
}