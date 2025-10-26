import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface ViewportDwellConfig {
  /** 需要在视口中持续停留的时间（毫秒），否则视为跳过不加载 */
  dwellMs?: number;
  /** 最长等待时间（毫秒），避免长时间滚动导致饥饿；到时仍可继续加载 */
  maxWaitMs?: number;
  /** 仅在进入视口时生效（true），否则所有加载都会应用驻留判断 */
  onlyWhenIntersecting?: boolean;
  /** 调试输出 */
  debug?: boolean;
}

/**
 * 视口驻留阈值插件：
 * - 在 onEnterViewport 记录进入时间；
 * - 在 onLeaveViewport 标记离开；
 * - 在 onLoad 中等待驻留时间，若期间离开则返回 false 阻止后续加载；
 * - 超过 maxWaitMs 时仍允许继续（避免饥饿）。
 */
export function createViewportDwellPlugin(config: ViewportDwellConfig = {}): LazyImagePlugin {
  const {
    dwellMs = 180,
    maxWaitMs = 1000,
    onlyWhenIntersecting = true,
    debug = false,
  } = config;

  const ENTER_KEY = "viewport-dwell:enteredAt";
  const LEFT_KEY = "viewport-dwell:left";

  const setEnter = (context: PluginContext, t: number) => {
    try { context.sharedData?.set(ENTER_KEY, t); } catch {}
    try { context.sharedData?.set(LEFT_KEY, false); } catch {}
  };
  const setLeft = (context: PluginContext, left: boolean) => {
    try { context.sharedData?.set(LEFT_KEY, left); } catch {}
  };
  const getEnter = (context: PluginContext): number | undefined => {
    return context.sharedData?.get(ENTER_KEY) as number | undefined;
  };
  const getLeft = (context: PluginContext): boolean => {
    return !!context.sharedData?.get(LEFT_KEY);
  };

  return {
    name: "viewport-dwell",
    version: "1.0.0",
    config,
    hooks: {
      // 在真正加载前进行驻留时间门控：返回 false 可阻止加载
      onBeforeLoad: async (context: PluginContext) => {
        // 仅在进入视口时进行驻留判断；否则不拦截（交由其它策略处理）
        if (onlyWhenIntersecting && !context.isIntersecting) {
          return true;
        }

        const startTs = Date.now();
        let enteredAt = getEnter(context);
        if (!enteredAt) {
          enteredAt = startTs;
          setEnter(context, enteredAt);
        }

        const elapsed = Date.now() - enteredAt;
        const waitNeeded = Math.max(0, dwellMs - elapsed);
        const waitBudget = Math.max(0, maxWaitMs);

        if (debug) {
          try {
            console.debug("[ViewportDwell] gating onBeforeLoad", {
              src: context.src,
              waitNeeded,
              waitBudget,
              elapsed,
            });
          } catch {}
        }

        // 若已满足驻留，直接放行
        if (waitNeeded <= 0) return true;

        // 等待驻留或达到最长等待
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
        const waitMs = Math.min(waitNeeded, waitBudget);
        try {
          await sleep(waitMs);
        } catch {}

        // 等待期间若离开且尚未达到 maxWait，阻止加载
        const left = getLeft(context);
        const waited = Date.now() - startTs;
        if (left && waited < maxWaitMs) {
          if (debug) {
            try { console.debug("[ViewportDwell] aborted due to leave", { src: context.src }); } catch {}
          }
          return false; // 阻止加载
        }

        // 到此：要么满足驻留，要么达到最长等待（避免饥饿），允许加载
        return true;
      },
      onEnterViewport: (context: PluginContext) => {
        setEnter(context, Date.now());
        if (debug) {
          try { console.debug("[ViewportDwell] enter", { src: context.src }); } catch {}
        }
      },
      onLeaveViewport: (context: PluginContext) => {
        setLeft(context, true);
        if (debug) {
          try { console.debug("[ViewportDwell] leave", { src: context.src }); } catch {}
        }
      },
      // 不替换加载逻辑，仅保持默认行为
      onLoad: (_context: PluginContext) => {
        return undefined;
      },
      onUnmount: (context: PluginContext) => {
        // 清理共享数据标记
        try {
          context.sharedData?.delete(ENTER_KEY);
          context.sharedData?.delete(LEFT_KEY);
        } catch {}
      },
    },
  };
}