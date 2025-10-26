import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface HoverPrefetchConfig {
  /** 计算需要预取的下一张图片（或多张） */
  getNextSrc?: (context: PluginContext) => string | string[] | Promise<string | string[]>;
  /** 绑定事件的目标：容器或图片元素 */
  target?: "container" | "image";
  /** 事件类型 */
  trigger?: "mouseenter" | "touchstart";
  /** 预取资源类型 */
  as?: "image" | "fetch";
  /** 预取的最大数量 */
  max?: number;
  /** 去重：避免重复插入相同的预取链接 */
  dedupe?: boolean;
  /** 跨域策略 */
  crossOrigin?: "anonymous" | "use-credentials" | null;
  /** 调试输出 */
  debug?: boolean;
}

function addPreload(href: string, as: HoverPrefetchConfig["as"] = "image", crossOrigin: HoverPrefetchConfig["crossOrigin"] = "anonymous") {
  try {
    // 仅在浏览器环境插入
    if (typeof document === "undefined") return;
    const link = document.createElement("link");
    link.setAttribute("rel", "preload");
    link.setAttribute("as", as || "image");
    link.setAttribute("href", href);
    if (crossOrigin) link.setAttribute("crossorigin", crossOrigin);
    document.head.appendChild(link);
    return () => {
      try { document.head.removeChild(link); } catch {}
    };
  } catch {}
  return undefined;
}

export function createHoverPrefetchPlugin(config: HoverPrefetchConfig = {}): LazyImagePlugin {
  const {
    getNextSrc,
    target = "container",
    trigger = "mouseenter",
    as = "image",
    max = 2,
    dedupe = true,
    crossOrigin = "anonymous",
    debug = false,
  } = config;

  const inserted = new Set<string>();

  async function handlePrefetch(context: PluginContext) {
    try {
      const result = getNextSrc ? await Promise.resolve(getNextSrc(context)) : undefined;
      if (!result) return;
      const list = Array.isArray(result) ? result : [result];
      const selected = list.slice(0, Math.max(1, max));
      selected.forEach((href) => {
        if (dedupe && inserted.has(href)) return;
        const cleanup = addPreload(href, as, crossOrigin);
        if (cleanup) inserted.add(href);
        if (debug) {
          try { console.debug("[HoverPrefetch] preload", { href, as }); } catch {}
        }
      });
    } catch (e) {
      if (debug) {
        try { console.debug("[HoverPrefetch] error", e); } catch {}
      }
    }
  }

  return {
    name: "hover-prefetch",
    version: "0.1.0",
    config,
    hooks: {
      onMount: (context: PluginContext) => {
        const container = context.containerRef?.current as HTMLElement | null;
        const img = context.imageRef?.current as HTMLElement | null;
        const el: HTMLElement | null = target === "container" ? container : img;
        if (!el) return;
        const handler = () => handlePrefetch(context);
        el.addEventListener(trigger, handler, { passive: true });
        // 将清理函数存入共享数据以便卸载时移除监听
        context.sharedData?.set("hover-prefetch:cleanup", () => {
          try { el.removeEventListener(trigger, handler); } catch {}
        });
      },
      onUnmount: (context: PluginContext) => {
        const cleanup = context.sharedData?.get("hover-prefetch:cleanup");
        if (typeof cleanup === "function") {
          try { cleanup(); } catch {}
        }
        inserted.clear();
      },
    },
  };
}