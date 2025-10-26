import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface ViewportDebounceConfig {
  debounceMs?: number; // 进出视口事件的去抖间隔
  onlyWhenIntersecting?: boolean; // 仅在进入视口时应用去抖
  debug?: boolean;
}

export function createViewportDebouncePlugin(config: ViewportDebounceConfig = {}): LazyImagePlugin {
  const { debounceMs = 150, onlyWhenIntersecting = true, debug = false } = config;

  return {
    name: "viewport-debounce",
    version: "1.0.0",
    config,
    hooks: {
      onEnterViewport: (context: PluginContext) => {
        const img = context.imageRef?.current as any;
        if (!img) return;
        const now = Date.now();
        const last = img.__lliLastEnterTs ?? 0;
        img.__lliLastEnterTs = now;
        if (onlyWhenIntersecting) {
          clearTimeout(img.__lliEnterTimer);
          img.__lliEnterTimer = setTimeout(() => {
            if (debug) console.log("[ViewportDebounce] stable enter", context.src);
            img.dataset.vpStable = "true";
          }, debounceMs);
        } else {
          const elapsed = now - last;
          if (elapsed < debounceMs) {
            if (debug) console.log("[ViewportDebounce] suppressed enter", context.src);
            return;
          }
        }
      },
      onLeaveViewport: (context: PluginContext) => {
        const img = context.imageRef?.current as any;
        if (!img) return;
        clearTimeout(img.__lliEnterTimer);
        img.dataset.vpStable = "false";
        if (debug) console.log("[ViewportDebounce] leave", context.src);
      },
      onUnmount: (context: PluginContext) => {
        const img = context.imageRef?.current as any;
        if (!img) return;
        clearTimeout(img.__lliEnterTimer);
        delete img.__lliEnterTimer;
        delete img.__lliLastEnterTs;
        delete img.dataset?.vpStable;
      },
    },
  };
}