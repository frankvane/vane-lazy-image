import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface DominantColorConfig {
  color?: string; // 指定颜色，若未提供则尝试从 lqip 中采样
  lqipSrc?: string | ((src: string) => string);
}

function resolveLqip(src: string, cfg: DominantColorConfig): string | undefined {
  const { lqipSrc } = cfg;
  if (!lqipSrc) return undefined;
  return typeof lqipSrc === "function" ? lqipSrc(src) : lqipSrc;
}

async function sampleAverageColor(url: string): Promise<string | undefined> {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const p = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
    img.src = url;
    const el = await p;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.min(16, el.naturalWidth));
    canvas.height = Math.max(1, Math.min(16, el.naturalHeight));
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;
    ctx.drawImage(el, 0, 0, canvas.width, canvas.height);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);
    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    return undefined;
  }
}

export function createDominantColorPlugin(config: DominantColorConfig = {}): LazyImagePlugin {
  const fallback = config.color ?? "rgba(0,0,0,0.06)";
  return {
    name: "dominant-color",
    version: "1.0.0",
    config,
    hooks: {
      onMount: (context: PluginContext) => {
        const container = context.containerRef?.current as HTMLElement | null;
        if (!container) return;
        try {
          const lqip = resolveLqip(context.src, config);
          if (lqip) {
            sampleAverageColor(lqip)
              .then((color) => {
                try { container.style.background = color || fallback; } catch {}
              })
              .catch(() => {
                try { container.style.background = fallback; } catch {}
              });
          } else {
            try { container.style.background = fallback; } catch {}
          }
        } catch {
          try { container.style.background = fallback; } catch {}
        }
      },
    },
  };
}