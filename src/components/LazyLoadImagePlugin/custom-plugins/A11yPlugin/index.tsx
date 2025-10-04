import React, { useEffect } from "react";
import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface A11yPluginConfig {
  enabled?: boolean;
  /** 标记为装饰性图片（将 aria-hidden 设为 true，清空 alt） */
  decorative?: boolean;
  /** 自定义 aria-label（若需要与 alt 区分开） */
  ariaLabel?: string | ((ctx: PluginContext) => string);
  /** 状态文本（加载中/加载成功/加载失败） */
  statusText?: {
    loading?: string;
    loaded?: string;
    error?: string;
  };
}

function getAriaLabel(config: A11yPluginConfig, ctx: PluginContext): string | undefined {
  const { ariaLabel } = config;
  if (!ariaLabel) return undefined;
  return typeof ariaLabel === "function" ? ariaLabel(ctx) : ariaLabel;
}

const VisuallyHiddenStatus: React.FC<{ ctx: PluginContext; config: A11yPluginConfig }> = ({ ctx, config }) => {
  const { imageState } = ctx;
  const text = imageState.isError
    ? config.statusText?.error ?? "图片加载失败"
    : imageState.isLoaded
    ? config.statusText?.loaded ?? "图片加载完成"
    : imageState.isLoading
    ? config.statusText?.loading ?? "图片加载中"
    : "图片未加载";

  useEffect(() => {
    const img = ctx.imageRef?.current;
    if (!img || !config.enabled) return;
    // 根据状态设置 aria-busy
    try { img.setAttribute("aria-busy", imageState.isLoading ? "true" : "false"); } catch {}
  }, [ctx.imageRef, config.enabled, imageState.isLoading]);

  return (
    <span
      role="status"
      aria-live="polite"
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      {text}
    </span>
  );
};

export function createA11yPlugin(config: A11yPluginConfig = {}): LazyImagePlugin {
  const { enabled = true, decorative = false } = config;
  return {
    name: "a11y",
    version: "1.0.0",
    config,
    hooks: {
      onMount: (context: PluginContext) => {
        if (!enabled) return;
        const img = context.imageRef?.current;
        if (!img) return;
        try {
          if (decorative) {
            img.setAttribute("aria-hidden", "true");
            // 装饰性图片不需要 alt 文本
            img.setAttribute("alt", "");
          }
          const label = getAriaLabel(config, context);
          if (label) {
            img.setAttribute("aria-label", label);
          }
          // 角色明确为图像（默认如此，但部分读屏器在复杂布局中更稳定）
          img.setAttribute("role", "img");
        } catch {}
      },

      renderOverlay: (context: PluginContext) => {
        if (!enabled) return null;
        return <VisuallyHiddenStatus ctx={context} config={config} />;
      },
    },
  };
}