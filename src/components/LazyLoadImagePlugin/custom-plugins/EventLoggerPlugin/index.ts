import type { LazyImagePlugin, PluginContext, ProgressInfo } from "../../plugins/types";

export interface EventLoggerConfig {
  enabled?: boolean;
  prefix?: string;
}

function log(prefix: string, ...args: any[]) {
  try {
    // eslint-disable-next-line no-console
    console.log(prefix, ...args);
  } catch {}
}

export function createEventLoggerPlugin(config: EventLoggerConfig = {}): LazyImagePlugin {
  const { enabled = true, prefix = "[LLI]" } = config;
  return {
    name: "event-logger",
    version: "1.0.0",
    config,
    hooks: {
      onBeforeLoad: (context: PluginContext) => {
        if (enabled) {
          log(prefix, "before-load", context.src);
        }
        return true;
      },
      onLoadSuccess: (context: PluginContext, displaySrc?: string) => {
        if (!enabled) return;
        log(prefix, "load-success", { src: context.src, displaySrc });
      },
      onLoadError: (context: PluginContext, error: Error | Event) => {
        if (enabled) {
          log(prefix, "load-error", { src: context.src, error });
        }
        return true;
      },
      onEnterViewport: (context: PluginContext) => {
        if (!enabled) return;
        log(prefix, "enter-viewport", context.src);
      },
      onLeaveViewport: (context: PluginContext) => {
        if (!enabled) return;
        log(prefix, "leave-viewport", context.src);
      },
      onProgress: (_context: PluginContext, progress: ProgressInfo) => {
        if (!enabled) return;
        log(prefix, "progress", progress.percent);
      },
    },
  };
}