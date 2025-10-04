import type { LazyImagePlugin } from "../../plugins/types";

export interface DecodeAfterIdleConfig {
  enabled?: boolean;
  timeoutMs?: number;
}

const ric: any =
  typeof (window as any) !== "undefined" && (window as any).requestIdleCallback
    ? (window as any).requestIdleCallback
    : (cb: Function, opts?: any) => setTimeout(cb, opts?.timeout ?? 0);

export function createDecodeAfterIdlePlugin(
  config: DecodeAfterIdleConfig = {}
): LazyImagePlugin {
  const { enabled = true, timeoutMs = 600 } = config;

  return {
    name: "decode-after-idle",
    version: "1.0.0",
    config,
    hooks: {
      onLoadSuccess: (context) => {
        if (!enabled) return;
        const img = context.imageRef?.current as HTMLImageElement | null;
        if (!img || !(img as any).decode) return;
        ric(async () => {
          try {
            await (img as any).decode?.();
          } catch {
            // ignore decode errors
          }
        }, { timeout: timeoutMs });
      },
      transformProps: (props) => ({
        ...props,
        decoding: "async" as any,
      }),
    },
  } as LazyImagePlugin;
}