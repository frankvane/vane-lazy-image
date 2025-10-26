import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

import type { LazyLoadImageCoreProps } from "../../core/LazyLoadImageCore";
// 🚀 性能优化：使用全局单例获取网络信息
import { getGlobalNetworkInfo } from "../../utils/GlobalContext";

type EffectiveType = "4g" | "3g" | "2g" | "slow-2g";

// 兼容浏览器 Network Information API 的最小类型定义
interface NetworkInformationLike {
  effectiveType?: EffectiveType;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  addEventListener?: (type: "change", listener: (e: Event) => void) => void;
  removeEventListener?: (type: "change", listener: (e: Event) => void) => void;
  onchange?: ((this: any, ev: Event) => any) | null;
}

export interface AdaptiveQualityConfig {
  lowQ?: number; // 低速网络质量值
  highQ?: number; // 高速网络质量值
  saveDataQuality?: number; // 省流模式质量值
  overrideEffectiveType?: EffectiveType; // Demo/测试覆盖
  overrideSaveData?: boolean; // Demo/测试覆盖
  /**
   * 模式：
   * - once：仅在初始时根据网络信息设置一次质量（默认）
   * - realtime：监听网络变化，每次变化重新计算并更新图片质量
   */
  mode?: "once" | "realtime";
}

function setQuality(u: URL, q: number) {
  try {
    const clamped = Math.max(1, Math.min(100, Math.round(q)));
    u.searchParams.set("q", String(clamped));
  } catch {}
}

// 🚀 性能优化：detectNetwork 已移至 GlobalContext
// 使用全局单例，避免重复检测

function getConnection(): NetworkInformationLike | undefined {
  const nav: any = typeof navigator !== "undefined" ? navigator : undefined;
  return (nav?.connection || nav?.mozConnection || nav?.webkitConnection) as NetworkInformationLike | undefined;
}

function computeQuality(cfg: AdaptiveQualityConfig): number {
  // 🚀 使用全局单例获取网络信息
  const net = getGlobalNetworkInfo();
  const saveData = cfg.overrideSaveData ?? net?.saveData;
  if (saveData) return cfg.saveDataQuality ?? 35;
  const eff: EffectiveType = cfg.overrideEffectiveType ?? net?.effectiveType ?? "4g";
  if (eff === "slow-2g" || eff === "2g") return cfg.lowQ ?? 40;
  if (eff === "3g") return cfg.lowQ ?? 55;
  return cfg.highQ ?? 80;
}

export function createAdaptiveQualityPlugin(config: AdaptiveQualityConfig = {}): LazyImagePlugin {
  return {
    name: "adaptive-quality",
    version: "1.0.0",
    config,
    hooks: {
      transformProps: (props: LazyLoadImageCoreProps): LazyLoadImageCoreProps => {
        const p: LazyLoadImageCoreProps = { ...props };
        try {
          const u = new URL(p.src, typeof window !== "undefined" ? window.location.origin : "http://localhost");
          const q = computeQuality(config);
          setQuality(u, q);
          p.src = u.toString();
        } catch {}
        return p;
      },
      onMount: (context: PluginContext) => {
        const { mode = "once" } = config;
        if (mode !== "realtime") return;
        const conn = getConnection();
        if (!conn) return;
        const handler = (_e?: Event) => {
          try {
            const img = context.imageRef?.current;
            const raw: string = img?.src || context.src;
            const u = new URL(raw, typeof window !== "undefined" ? window.location.origin : "http://localhost");
            const q = computeQuality(config);
            setQuality(u, q);
            if (img) img.src = u.toString(); else (context as any).src = u.toString();
          } catch {}
        };
        try {
          if (typeof conn.addEventListener === "function") {
            conn.addEventListener("change", handler);
            context.sharedData?.set("aqp-handler", handler);
            context.sharedData?.set("aqp-conn", conn);
          } else if ("onchange" in conn) {
            // 兼容旧实现
            const prev = conn.onchange;
            conn.onchange = (e: Event) => {
              // eslint-disable-next-line
              try { typeof prev === "function" && prev.call(conn, e); } catch {}
              handler(e);
            };
            context.sharedData?.set("aqp-conn", conn);
            context.sharedData?.set("aqp-onchange-patched", true);
          }
        } catch {}
        return () => {
          try {
            const c = context.sharedData?.get("aqp-conn") as NetworkInformationLike | undefined;
            const h = context.sharedData?.get("aqp-handler") as ((e: Event) => void) | undefined;
            if (c && h && typeof c.removeEventListener === "function") {
              c.removeEventListener("change", h);
            } else if (c && (context.sharedData?.get("aqp-onchange-patched") as boolean)) {
              try { c.onchange = null; } catch {}
            }
          } catch {}
        };
      },
    },
  };
}