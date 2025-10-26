import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface ParallaxConfig {
  strength?: number; // 0..1，偏移强度（默认 0.2）
  axis?: "y" | "x"; // 轴向
}

export function createParallaxPlugin(config: ParallaxConfig = {}): LazyImagePlugin {
  const strength = Math.max(0, Math.min(1, config.strength ?? 0.2));
  const axis = config.axis ?? "y";

  function update(img: HTMLElement) {
    const rect = img.getBoundingClientRect();
    const viewport = typeof window !== "undefined" ? window.innerHeight : 800;
    const center = rect.top + rect.height / 2;
    const offset = ((center - viewport / 2) / viewport) * (strength * 100);
    const tx = axis === "x" ? offset : 0;
    const ty = axis === "y" ? offset : 0;
    (img as any).style.transform = `translate(${tx}px, ${ty}px)`;
  }

  return {
    name: "parallax",
    version: "1.0.0",
    config,
    hooks: {
      onMount: (context: PluginContext) => {
        const img = context.imageRef?.current as any;
        if (!img) return;
        img.style.willChange = "transform";

        // 🔥 关键修复：使用 RAF 优化性能
        let ticking = false;
        let rafId: number | null = null;

        const onScroll = () => {
          if (!ticking) {
            rafId = requestAnimationFrame(() => {
              update(img);
              ticking = false;
            });
            ticking = true;
          }
        };

        const onResize = () => {
          if (!ticking) {
            rafId = requestAnimationFrame(() => {
              update(img);
              ticking = false;
            });
            ticking = true;
          }
        };

        img.__lliParallaxScroll = onScroll;
        img.__lliParallaxResize = onResize;
        img.__lliParallaxRafId = rafId;

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize, { passive: true });
        update(img);

        // 🔥 返回清理函数
        return () => {
          if (img.__lliParallaxRafId !== null) {
            cancelAnimationFrame(img.__lliParallaxRafId);
          }
        };
      },
      onUnmount: (context: PluginContext) => {
        const img = context.imageRef?.current as any;
        if (!img) return;

        // 🔥 取消 RAF
        if (img.__lliParallaxRafId !== null) {
          try {
            cancelAnimationFrame(img.__lliParallaxRafId);
          } catch {}
        }

        const onScroll = img.__lliParallaxScroll;
        const onResize = img.__lliParallaxResize;
        if (onScroll) window.removeEventListener("scroll", onScroll as any);
        if (onResize) window.removeEventListener("resize", onResize as any);
        img.style.transform = "";
        img.style.willChange = "";
        delete img.__lliParallaxScroll;
        delete img.__lliParallaxResize;
        delete img.__lliParallaxRafId;
      },
    },
  };
}