import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface MemoryPressureAbortConfig {
  enabled?: boolean;
  /** 设备内存<=该阈值时启用降质（GB） */
  deviceMemoryThreshold?: number;
  /** 移动端或省流模式时强制启用降质 */
  preferOnMobile?: boolean;
  /** 重写到低清晰度：针对常见图片域名的宽度参数 */
  lowWidth?: number;
}

function rewriteToLowQuality(src: string, width: number): string {
  try {
    const url = new URL(src, window.location.href);
    const host = url.host;
    const params = url.searchParams;
    // 常见源：unsplash 与京东图片服务
    if (/images\.unsplash\.com$/i.test(host)) {
      params.set("w", String(width));
      params.set("auto", "format");
      params.set("fit", "crop");
      url.search = params.toString();
      return url.toString();
    }
    if (/img\d+\.360buyimg\.com$/i.test(host)) {
      params.set("w", String(width));
      params.set("auto", "format");
      params.set("fit", "crop");
      url.search = params.toString();
      return url.toString();
    }
    // 通用：若无查询参数则附加一个常见压缩参数集合
    if (!url.search || url.search === "") {
      url.search = `?w=${width}&auto=format&fit=crop`;
    }
    return url.toString();
  } catch {
    return src;
  }
}

export function createMemoryPressureAbortPlugin(
  config: MemoryPressureAbortConfig = {}
): LazyImagePlugin {
  const {
    enabled = true,
    deviceMemoryThreshold = 4,
    preferOnMobile = true,
    lowWidth = 640,
  } = config;

  const shouldDowngrade = (ctx: PluginContext): boolean => {
    const nav: any = typeof navigator !== "undefined" ? navigator : undefined;
    const deviceMemory = Number(nav?.deviceMemory || 8);
    const isMobile = ctx.deviceInfo?.type === "mobile";
    const saveData = Boolean(ctx.networkInfo?.saveData);
    return (
      (deviceMemory && deviceMemory <= deviceMemoryThreshold) ||
      (preferOnMobile && isMobile) ||
      saveData
    );
  };

  return {
    name: "memory-pressure-abort",
    version: "1.0.0",
    config,
    hooks: {
      onLoad: (context) => {
        if (!enabled) return undefined;
        if (!shouldDowngrade(context)) return undefined;
        const downgraded = rewriteToLowQuality(context.src, lowWidth);
        return downgraded;
      },
      onLeaveViewport: (context) => {
        // 若后续集成 FetchLoaderPlugin，可在此中断下载；目前仅保留接口用于演示
        void context;
      },
    },
  } as LazyImagePlugin;
}