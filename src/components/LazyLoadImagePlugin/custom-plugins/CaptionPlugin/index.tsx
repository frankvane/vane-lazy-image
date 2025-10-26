import React from "react";
import type { LazyImagePlugin } from "../../plugins/types";

export type CaptionPluginConfig = {
  text?: string | ((src?: string) => string);
  position?: "top" | "bottom";
  bg?: string;
  color?: string;
};

export const createCaptionPlugin = (
  config?: CaptionPluginConfig
): LazyImagePlugin => {
  const position = config?.position ?? "bottom";
  const bg = config?.bg ?? "rgba(0,0,0,0.55)";
  const color = config?.color ?? "#fff";

  return {
    name: "caption",
    hooks: {
      renderOverlay(context) {
        const src = context.src;
        const text = typeof config?.text === "function" ? config?.text(src) : config?.text ?? "";
        if (!text) return null;
        const style: React.CSSProperties = {
          position: "absolute",
          left: 0,
          right: 0,
          [position]: 0,
          padding: "6px 10px",
          background: bg,
          color,
          fontSize: 12,
          zIndex: 2,
          pointerEvents: "none",
        } as React.CSSProperties;

        return <div style={style}>{text}</div>;
      },
    },
  };
};

export default createCaptionPlugin;