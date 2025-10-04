import React from "react";
import type { LazyImagePlugin } from "../../plugins/types";

export interface RedactionBox {
  /** 百分比位置与大小 0-1 */
  x: number;
  y: number;
  w: number;
  h: number;
  blur?: number;
  color?: string;
}

export interface RedactionConfig {
  enabled?: boolean;
  boxes?: RedactionBox[];
  zIndex?: number;
}

export function createRedactionPlugin(
  config: RedactionConfig = {}
): LazyImagePlugin {
  const { enabled = true, boxes = [], zIndex = 3 } = config;

  return {
    name: "redaction",
    version: "1.0.0",
    config,
    hooks: {
      render: (context) => {
        if (!enabled || !boxes.length) return null;
        return (
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex,
            }}
          >
            {boxes.map((b, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${b.x * 100}%`,
                  top: `${b.y * 100}%`,
                  width: `${b.w * 100}%`,
                  height: `${b.h * 100}%`,
                  background: b.color ?? "rgba(0,0,0,0.35)",
                  backdropFilter: b.blur ? `blur(${b.blur}px)` : undefined,
                  borderRadius: 6,
                }}
              />
            ))}
          </div>
        );
      },
    },
  } as LazyImagePlugin;
}