import React, { useMemo } from "react";
import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface ErrorOverlayConfig {
  message?: string | ((context: PluginContext) => string);
  background?: string;
  color?: string;
  zIndex?: number;
  showRetry?: boolean;
  retryText?: string;
  // 是否在回退图片加载成功后仍显示错误覆盖层
  persistAfterFallback?: boolean;
}

function ErrorOverlayView({ context, cfg }: { context: PluginContext; cfg: ErrorOverlayConfig }) {
  const {
    imageState,
    imageRef,
    src,
  } = context;

  // 发生过错误则打标，允许在回退成功后继续显示覆盖层
  const hadError = Boolean(context.sharedData?.get("had-error"));
  const shouldShow = imageState.isError || ((cfg.persistAfterFallback ?? true) && hadError);
  const message = useMemo(() => {
    const base = typeof cfg.message === "function" ? cfg.message(context) : cfg.message;
    return base ?? "加载失败";
  }, [cfg.message, context]);

  if (!shouldShow) return null;

  const retry = () => {
    const img = imageRef?.current;
    if (!img) return;
    try {
      const bust = `${src}${src.includes("?") ? "&" : "?"}retry=${Date.now()}`;
      img.src = bust;
    } catch {}
  };

  const base: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background: cfg.background ?? "rgba(220, 53, 69, 0.18)",
    color: cfg.color ?? "#b00020",
    zIndex: cfg.zIndex ?? 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "auto",
    gap: 8,
    fontSize: 13,
    fontWeight: 500,
  };

  return (
    <div style={base}>
      <span>{message}</span>
      {cfg.showRetry !== false && (
        <button onClick={retry} style={{ padding: "4px 8px", fontSize: 12 }}> {cfg.retryText ?? "重试"} </button>
      )}
    </div>
  );
}

export function createErrorOverlayPlugin(config: ErrorOverlayConfig = {}): LazyImagePlugin {
  return {
    name: "error-overlay",
    version: "1.0.0",
    config,
    hooks: {
      renderOverlay: (context) => <ErrorOverlayView context={context} cfg={config} />,
    },
  };
}