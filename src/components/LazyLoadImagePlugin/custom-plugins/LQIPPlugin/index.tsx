import React from "react";
import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface LqipPluginConfig {
  lqipSrc?: string | ((src: string) => string);
  blur?: number; // px
  opacity?: number; // 0~1
  zIndex?: number;
}

function resolveLqip(src: string, cfg: LqipPluginConfig): string | undefined {
  const { lqipSrc } = cfg;
  if (!lqipSrc) return undefined;
  return typeof lqipSrc === "function" ? lqipSrc(src) : lqipSrc;
}

export function createLqipPlugin(config: LqipPluginConfig = {}): LazyImagePlugin {
  const { blur = 12, opacity = 1, zIndex = 2 } = config;
  return {
    name: "lqip",
    version: "1.0.0",
    config,
    hooks: {
      renderOverlay: (context: PluginContext) => {
        const { imageState, src } = context;
        const lqip = resolveLqip(src, config);
        if (!lqip) return null;
        const visible = !imageState.isLoaded; // 加载完成后隐藏
        if (!visible) return null;
        const style: React.CSSProperties = {
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${lqip})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: `blur(${blur}px)`,
          opacity,
          zIndex,
          pointerEvents: "none",
          transition: "opacity 300ms ease",
        };
        return <div style={style} />;
      },
    },
  };
}