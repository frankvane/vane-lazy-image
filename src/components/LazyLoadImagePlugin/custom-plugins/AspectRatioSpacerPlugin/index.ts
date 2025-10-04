import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface AspectRatioSpacerConfig {
  /** 如 4/3、16/9，或直接传数字（宽/高） */
  ratio?: number;
}

export function createAspectRatioSpacerPlugin(config: AspectRatioSpacerConfig = {}): LazyImagePlugin {
  const { ratio = 4 / 3 } = config;
  return {
    name: "aspect-ratio-spacer",
    version: "1.0.0",
    config,
    hooks: {
      onMount: (context: PluginContext) => {
        const container = context.containerRef?.current as HTMLElement | null;
        if (!container) return;
        try {
          // 使用现代 CSS aspect-ratio 优先保持布局稳定
          (container as HTMLElement).style.aspectRatio = String(ratio);
        } catch {}
      },
    },
  };
}