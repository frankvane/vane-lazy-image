import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface ResponsiveVariant {
  width: number; // 宽度（像素）
  src?: string; // 可选：直接提供该宽度的 URL
}

export interface ResponsivePluginConfig {
  enabled?: boolean;
  /** 生成不同宽度的图片链接 */
  variants?: ResponsiveVariant[];
  /** 自定义生成函数：从基础 src 生成指定宽度的链接 */
  buildSrc?: (baseSrc: string, width: number) => string;
  /** sizes 属性（例如 "(max-width: 640px) 100vw, 800px"） */
  sizes?: string;
}

function defaultBuildSrc(base: string, width: number): string {
  // 默认方案：追加查询参数 ?w=width（常见图床兼容）
  try {
    const u = new URL(base);
    u.searchParams.set("w", String(width));
    return u.toString();
  } catch {
    return base.includes("?") ? `${base}&w=${width}` : `${base}?w=${width}`;
  }
}

export function createResponsivePlugin(config: ResponsivePluginConfig = {}): LazyImagePlugin {
  const { enabled = true, variants = [
    { width: 400 },
    { width: 800 },
    { width: 1200 },
  ], buildSrc = defaultBuildSrc, sizes = "(max-width: 800px) 100vw, 800px" } = config;

  return {
    name: "responsive",
    version: "1.0.0",
    config,
    hooks: {
      // 使用 DOM 属性设置 srcset/sizes（核心不透传未知 props）
      onLoadSuccess: (context: PluginContext) => {
        if (!enabled) return;
        const img = context.imageRef?.current;
        if (!img) return;

        const base = context.src;
        const parts = variants.map((v) => {
          const url = v.src ?? buildSrc(base, v.width);
          return `${url} ${v.width}w`;
        });
        try {
          img.setAttribute("srcset", parts.join(", "));
          img.setAttribute("sizes", sizes);
        } catch {}
      },
      onSrcChange: (_context: PluginContext, _oldSrc: string, _newSrc: string) => {
        // 源变化时，让浏览器根据新的 srcset 选择最佳资源
        // 无需额外处理，保持简单
        return true;
      },
    },
  };
}