import React from "react";
import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface SvgPlaceholderConfig {
  /** SVG 字符串内容，或动态生成函数 */
  svgContent?: string | ((context: PluginContext) => string);
  /** 叠加层背景（可用于增强对比度） */
  background?: string;
  /** 叠加层透明度 */
  opacity?: number; // 0..1
  /** 叠加层层级 */
  zIndex?: number;
  /** 显示条件 */
  showWhen?: "always" | "idle" | "loading" | "loaded" | "error";
  /** 是否在加载成功后淡出 */
  fadeOutOnLoaded?: boolean;
}

function SvgOverlay({
  context,
  config,
}: {
  context: PluginContext;
  config: SvgPlaceholderConfig;
}) {
  const { imageState } = context;
  const {
    background = "transparent",
    opacity = 1,
    zIndex = 3,
    showWhen = "loading",
    fadeOutOnLoaded = true,
  } = config;

  const shouldShow = (() => {
    switch (showWhen) {
      case "always":
        return true;
      case "idle":
        return imageState.isIdle;
      case "loading":
        return imageState.isLoading;
      case "loaded":
        return imageState.isLoaded;
      case "error":
        return imageState.isError;
      default:
        return imageState.isLoading;
    }
  })();

  if (!shouldShow) return null;

  const svgContent = typeof config.svgContent === "function"
    ? config.svgContent(context)
    : config.svgContent;

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background,
    zIndex,
    pointerEvents: "none",
    opacity: fadeOutOnLoaded && imageState.isLoaded ? 0 : opacity,
    transition: fadeOutOnLoaded ? "opacity 240ms ease" : undefined,
  };

  return (
    <div style={baseStyle} aria-hidden>
      {/* 直接注入 SVG 字符串，可包含 <svg>... */}
      {svgContent ? (
        <div
          style={{ width: "60%", height: "60%" }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : null}
    </div>
  );
}

export function createSvgPlaceholderPlugin(
  config: SvgPlaceholderConfig = {}
): LazyImagePlugin {
  return {
    name: "svg-placeholder",
    version: "1.0.0",
    config,
    hooks: {
      renderOverlay: (context) => <SvgOverlay context={context} config={config} />,
    },
  };
}

export default createSvgPlaceholderPlugin;