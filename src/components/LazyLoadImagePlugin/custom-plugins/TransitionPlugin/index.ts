import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface TransitionPluginConfig {
  durationMs?: number;
  easing?: string;
  fromOpacity?: number;
  toOpacity?: number;
  fromScale?: number;
  toScale?: number;
}

function applyInitialStyle(context: PluginContext, cfg: TransitionPluginConfig) {
  const img = context.imageRef?.current;
  if (!img) return;
  try {
    img.style.opacity = String(cfg.fromOpacity ?? 0);
    img.style.transform = `scale(${cfg.fromScale ?? 0.98})`;
    img.style.transition = `opacity ${cfg.durationMs ?? 300}ms ${cfg.easing ?? "ease"}, transform ${cfg.durationMs ?? 300}ms ${cfg.easing ?? "ease"}`;
  } catch {}
}

function applyFinalStyle(context: PluginContext, cfg: TransitionPluginConfig) {
  const img = context.imageRef?.current;
  if (!img) return;
  try {
    img.style.opacity = String(cfg.toOpacity ?? 1);
    img.style.transform = `scale(${cfg.toScale ?? 1})`;
  } catch {}
}

export function createTransitionPlugin(config: TransitionPluginConfig = {}): LazyImagePlugin {
  return {
    name: "transition",
    version: "1.0.0",
    config,
    hooks: {
      onMount: (context) => {
        applyInitialStyle(context, config);
      },
      onLoadSuccess: (context) => {
        applyFinalStyle(context, config);
      },
    },
  };
}