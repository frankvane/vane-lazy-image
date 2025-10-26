import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface RetryOnErrorConfig {
  maxRetries?: number;
  baseDelayMs?: number; // 退避基准毫秒
  jitter?: boolean;
}

function scheduleRetry(context: PluginContext, cfg: RetryOnErrorConfig, count: number) {
  const delay = (cfg.baseDelayMs ?? 500) * Math.pow(2, Math.max(0, count - 1));
  const jitter = cfg.jitter ? Math.random() * 0.25 * delay : 0;
  const finalDelay = delay + jitter;
  setTimeout(() => {
    const img = context.imageRef?.current;
    if (!img) return;
    try {
      const bust = `${context.src}${context.src.includes("?") ? "&" : "?"}retry=${Date.now()}&n=${count}`;
      img.src = bust;
    } catch {}
  }, finalDelay);
}

export function createRetryOnErrorPlugin(config: RetryOnErrorConfig = {}): LazyImagePlugin {
  const { maxRetries = 2 } = config;
  return {
    name: "retry-on-error",
    version: "1.0.0",
    config,
    hooks: {
      onLoadError: (context: PluginContext, _error: Error | Event) => {
        // 标记曾出现错误，便于错误徽标在回退或后续成功后仍显示
        try { context.sharedData?.set("had-error", true); } catch {}
        const key = "retry-count";
        const prev = Number(context.sharedData?.get(key) ?? 0);
        const next = prev + 1;
        if (next <= maxRetries) {
          context.sharedData?.set(key, next);
          scheduleRetry(context, config, next);
          return true; // 错误已处理，正在重试
        }
        // 重试用尽，返回 false 让错误继续传播到其他插件
        return false;
      },
    },
  };
}