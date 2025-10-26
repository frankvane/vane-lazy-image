import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface ScrollIdleConfig {
  /** 判定为“空闲”的静止时间（毫秒） */
  idleMs?: number;
  /** 是否仅在进入视口后生效（否则所有加载都会等待空闲） */
  onlyWhenIntersecting?: boolean;
  /** 最长等待空闲的时间（毫秒），超过则直接继续加载，避免长时间滚动导致饥饿 */
  maxWaitMs?: number;
  /** 监听对象：window 或容器（容器将使用 context.containerRef.current） */
  target?: "window" | "container";
  /** 滚动轴向：vertical/horizontal/both（目前用于调试标注，可按需扩展策略） */
  axis?: "vertical" | "horizontal" | "both";
  /** 调试输出 */
  debug?: boolean;
}

/**
 * 简单的全局滚动空闲检测器（单例），提供等待空闲的 Promise。
 */
const ScrollIdleWatcher = (() => {
  type TargetKey = "window" | HTMLElement;
  const map = new Map<
    TargetKey,
    {
      isIdle: boolean;
      timer: any;
      idleWaiters: Set<(v: void) => void>;
      idleMs: number;
      initialized: boolean;
      cleanup?: () => void;
    }
  >();

  function ensure(target: TargetKey, idleMs: number) {
    const existing = map.get(target);
    if (existing && existing.initialized) {
      existing.idleMs = idleMs > 0 ? idleMs : existing.idleMs;
      return existing;
    }
    const state = {
      isIdle: true,
      timer: null as any,
      idleWaiters: new Set<(v: void) => void>(),
      idleMs: idleMs > 0 ? idleMs : 120,
      initialized: false,
      cleanup: undefined as undefined | (() => void),
    };

    const onScroll = () => {
      state.isIdle = false;
      if (state.timer) clearTimeout(state.timer);
      state.timer = setTimeout(() => {
        state.isIdle = true;
        state.idleWaiters.forEach((fn) => {
          try { fn(); } catch {}
        });
        state.idleWaiters.clear();
      }, state.idleMs);
    };

    if (target === "window") {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("wheel", onScroll, { passive: true });
      window.addEventListener("touchmove", onScroll, { passive: true });
      state.cleanup = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("wheel", onScroll);
        window.removeEventListener("touchmove", onScroll);
      };
    } else {
      try {
        target.addEventListener("scroll", onScroll as any, { passive: true } as any);
        target.addEventListener("wheel", onScroll as any, { passive: true } as any);
        target.addEventListener("touchmove", onScroll as any, { passive: true } as any);
      } catch {}
      state.cleanup = () => {
        try {
          target.removeEventListener("scroll", onScroll as any);
          target.removeEventListener("wheel", onScroll as any);
          target.removeEventListener("touchmove", onScroll as any);
        } catch {}
      };
    }

    state.initialized = true;
    map.set(target, state);
    return state;
  }

  async function waitForIdle(target: TargetKey, idleMs: number, maxWaitMs?: number): Promise<void> {
    const s = ensure(target, idleMs);
    if (s.isIdle) return;
    await new Promise<void>((resolve) => {
      let timeout: any = null;
      const resolver = () => {
        if (timeout) clearTimeout(timeout);
        resolve();
      };
      s.idleWaiters.add(resolver);
      if (typeof maxWaitMs === "number" && maxWaitMs > 0) {
        timeout = setTimeout(() => {
          s.idleWaiters.delete(resolver);
          resolve();
        }, maxWaitMs);
      }
    });
  }

  return { ensure, waitForIdle };
})();

export function createScrollIdlePlugin(config: ScrollIdleConfig = {}): LazyImagePlugin {
  const {
    idleMs = 120,
    onlyWhenIntersecting = true,
    maxWaitMs = 1200,
    target = "window",
    axis = "vertical",
    debug = false,
  } = config;

  return {
    name: "scroll-idle",
    version: "1.0.0",
    config,
    hooks: {
      onMount: (context: PluginContext) => {
        const container = context.containerRef?.current || null;
        const key = target === "container" && container ? container : "window";
        ScrollIdleWatcher.ensure(key, idleMs);
        if (debug) {
          try {
            console.debug("[ScrollIdle] mount", { idleMs, target, axis, hasContainer: !!container });
          } catch {}
        }
      },
      onLoad: async (context: PluginContext) => {
        // 仅在进入视口时应用，或配置为全局应用
        if (context.props.loading === "eager") {
          // 对 eager 加载的资源不做等待，尊重优先级
          return undefined;
        }
        if (!onlyWhenIntersecting || context.isIntersecting) {
          const container = context.containerRef?.current || null;
          const key = target === "container" && container ? container : "window";
          if (debug) console.debug(`[ScrollIdle] waiting for idle ${idleMs}ms (max ${maxWaitMs}ms)`, { target, axis });
          try {
            await ScrollIdleWatcher.waitForIdle(key, idleMs, maxWaitMs);
          } catch {}
        }
        return undefined;
      },
    },
  };
}