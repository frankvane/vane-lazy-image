import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface BlurUpConfig {
  startBlur?: number; // px
  endBlur?: number; // px
  durationMs?: number;
}

export function createBlurUpPlugin(config: BlurUpConfig = {}): LazyImagePlugin {
  const { startBlur = 8, endBlur = 0, durationMs = 400 } = config;
  return {
    name: "blur-up",
    version: "1.0.0",
    config,
    hooks: {
      // 在 props 层为 <img> 注入初始模糊，确保元素挂载后立即可见
      transformProps: (props) => {
        const prevFilter = (props.imageStyle as any)?.filter as string | undefined;
        const base = (prevFilter || "").replace(/blur\([^)]*\)/, "").trim();
        const nextFilter = base ? `${base} blur(${startBlur}px)` : `blur(${startBlur}px)`;

        const prevTransition = (props.imageStyle as any)?.transition as string | undefined;
        // 合成过渡，确保不丢失不透明度的过渡，同时添加 filter 过渡
        const opacityTransition = "opacity 180ms ease";
        const hasOpacity = !!prevTransition && /opacity\s*\d*ms/.test(prevTransition);
        const transitionBase = hasOpacity ? prevTransition! : opacityTransition;
        const nextTransition = `${transitionBase}, filter ${durationMs}ms ease`;

        const willChangePrev = (props.imageStyle as any)?.willChange as string | undefined;
        const willChange = willChangePrev
          ? `${willChangePrev}, filter`
          : "filter";

        return {
          ...props,
          imageStyle: {
            ...(props.imageStyle || {}),
            filter: nextFilter,
            transition: nextTransition,
            willChange,
          },
        } as typeof props;
      },
      onBeforeLoad: (context: PluginContext) => {
        const img = context.imageRef?.current as any;
        if (!img) return true;

        try {
          const prev: string = img.style.filter || "";
          const base = prev.replace(/blur\([^)]*\)/, "").trim();
          img.__lliPrevFilterNoBlur = base;
          const next = base ? `${base} blur(${startBlur}px)` : `blur(${startBlur}px)`;
          img.style.filter = next;
          const t = img.style.transition || "";
          img.style.transition = t ? `${t}, filter ${durationMs}ms ease` : `filter ${durationMs}ms ease`;
        } catch {}
        return true;
      },
      onLoadSuccess: (context: PluginContext) => {
        const img = context.imageRef?.current as any;
        if (!img) return;
        try {
          const base = img.__lliPrevFilterNoBlur ?? (img.style.filter || "").replace(/blur\([^)]*\)/, "").trim();
          const next = endBlur > 0 ? (base ? `${base} blur(${endBlur}px)` : `blur(${endBlur}px)`) : base;
          img.style.filter = next;
        } catch {}
      },
      onUnmount: (context: PluginContext) => {
        const img = context.imageRef?.current as any;
        if (!img) return;
        try {
          if (img.__lliPrevFilterNoBlur !== undefined) {
            img.style.filter = img.__lliPrevFilterNoBlur || "";
            delete img.__lliPrevFilterNoBlur;
          }
        } catch {}
      },
    },
  };
}