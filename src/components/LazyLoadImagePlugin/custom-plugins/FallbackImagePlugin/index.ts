import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface FallbackImageConfig {
  fallbackSrc: string; // 例如 "/404.jpg"
}

export function createFallbackImagePlugin(config: FallbackImageConfig): LazyImagePlugin {
  const { fallbackSrc } = config;
  return {
    name: "fallback-image",
    version: "1.0.0",
    config,
    hooks: {
      onLoadError: (context: PluginContext, _error: Error) => {
        // 记录发生过错误，供 ErrorBadge 等组件在回退成功后仍可显示
        try { context.sharedData?.set("had-error", true); } catch {}
        const img = context.imageRef?.current;
        if (!img) return true;
        try {
          img.src = fallbackSrc;
        } catch {}
        return true;
      },
    },
  };
}