import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

import React from "react";

export interface ErrorBadgeConfig {
  text?: string | ((context: PluginContext) => string);
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  bgColor?: string;
  color?: string;
  fontSize?: number;
  padding?: string;
  borderRadius?: number;
  zIndex?: number;
  // 是否在回退加载成功后仍显示错误徽标
  persistAfterFallback?: boolean;
}

export function createErrorBadgePlugin(config: ErrorBadgeConfig = {}): LazyImagePlugin {
  const {
    text = "Error",
    position = "top-right",
    bgColor = "rgba(220, 53, 69, 0.85)",
    color = "#fff",
    fontSize = 12,
    padding = "2px 6px",
    borderRadius = 4,
    // 提高默认 zIndex，避免被 ErrorOverlay 等盖住
    zIndex = 100,
    persistAfterFallback = true,
  } = config;

  return {
    name: "error-badge",
    version: "1.0.0",
    config,
    hooks: {
      // 发生错误时记录共享数据，便于在回退成功后仍可显示徽标
      onLoadError: (context: PluginContext) => {
        try { context.sharedData?.set("had-error", true); } catch {}
        return true;
      },
      // 使用 overlay 渲染层，保证位于图片与其他内容之上
      renderOverlay: (context: PluginContext) => {
        const hadError = Boolean(context.sharedData?.get("had-error"));
        const shouldShow = context.imageState.isError || (persistAfterFallback && hadError);

        if (!shouldShow) return null;
        const label = typeof text === "function" ? text(context) : text;

        // 覆盖层容器，保证在图片之上（防止被其他元素覆盖）
        const overlayRoot: React.CSSProperties = {
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex,
        };

        const baseStyle: React.CSSProperties = {
          position: "absolute",
          background: bgColor,
          color,
          fontSize,
          padding,
          borderRadius,
          lineHeight: 1.2,
          fontWeight: 600,
        };

        const posStyle: Record<string, React.CSSProperties> = {
          "top-left": { top: 8, left: 8 },
          "top-right": { top: 8, right: 8 },
          "bottom-left": { bottom: 8, left: 8 },
          "bottom-right": { bottom: 8, right: 8 },
          center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
        };

        return (
          <div style={overlayRoot}>
            <div style={{ ...baseStyle, ...posStyle[position] }}>{label}</div>
          </div>
        );
      },
    },
  };
}