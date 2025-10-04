import type { LazyImagePlugin, PluginContext } from "../../plugins/types";
import type React from "react";

export interface SEOPluginConfig {
  enabled?: boolean;
  /** 若未提供 alt，则使用该回退值 */
  altFallback?: string;
  /** 设置图片 title（用于提示与关键词） */
  title?: string;
  /** 设置容器的固定长宽比，减少 CLS（例如 "4/3"、"16/9"） */
  aspectRatio?: string;
  /** 将首屏关键图片设为 eager 加载 */
  priority?: "auto" | "lcp";
  /** 在挂载时注入 <link rel="preload" as="image"> */
  preload?: boolean;
}

function addPreloadLink(href: string): () => void {
  try {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = href;
    document.head.appendChild(link);
    return () => {
      try { document.head.removeChild(link); } catch {}
    };
  } catch {
    return () => {};
  }
}

export function createSEOPlugin(config: SEOPluginConfig = {}): LazyImagePlugin {
  const {
    enabled = true,
    altFallback,
    title,
    aspectRatio,
    priority = "auto",
    preload = false,
  } = config;

  return {
    name: "seo",
    version: "1.0.0",
    config,
    hooks: {
      transformProps: (props) => {
        if (!enabled) return props;
        const next = { ...props };
        // alt 回退
        if ((!next.alt || next.alt === "") && altFallback) {
          next.alt = altFallback;
        }
        // 优先级控制：LCP 图片使用 eager
        if (priority === "lcp") {
          next.loading = "eager";
          next.rootMargin = "0px";
        }
        // 固定容器长宽比，减少布局偏移
        if (aspectRatio) {
          next.containerStyle = {
            ...(next.containerStyle || {}),
            aspectRatio,
          } as React.CSSProperties;
        }
        return next;
      },

      onMount: (context: PluginContext) => {
        if (!enabled) return;
        // 预加载（初始化为 undefined，避免“在赋值前使用变量”警告）
        let cleanup: (() => void) | undefined = undefined;
        if (preload) {
          cleanup = addPreloadLink(context.src);
        }
        // title（DOM 属性）
        if (title) {
          try { context.imageRef?.current?.setAttribute("title", title); } catch {}
        }
        // alt 回退（若 transformProps 未覆盖，仍尝试设置一次）
        if (altFallback && context.imageRef?.current) {
          const img = context.imageRef.current;
          if (img.getAttribute("alt") === null || img.getAttribute("alt") === "") {
            try { img.setAttribute("alt", altFallback); } catch {}
          }
        }
        return cleanup;
      },
    },
  };
}