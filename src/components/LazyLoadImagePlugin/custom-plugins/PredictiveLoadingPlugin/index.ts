import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface PredictiveLoadingPluginConfig {
  model?: "heuristic" | "ml";
  /** 返回需要预加载的图片链接列表 */
  predict?: (context: PluginContext) => string[] | Promise<string[]>;
  maxPreload?: number;
  as?: "image" | "fetch";
  crossOrigin?: "anonymous" | "use-credentials" | null;
}

function addPreload(
  href: string,
  as: "image" | "fetch",
  crossOrigin: "anonymous" | "use-credentials" | null = "anonymous"
) {
  if (typeof document === "undefined") return;
  try {
    const id = `lli-preload-${as}-${href}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "preload";
    // 使用 setAttribute 避免在部分 TS DOM 配置下的类型问题
    link.setAttribute("as", as);
    link.href = href;
    if (crossOrigin) {
      // 避免直接写属性导致类型不匹配，改用 setAttribute
      link.setAttribute("crossorigin", crossOrigin);
    }
    document.head.appendChild(link);
  } catch {
    // 忽略 DOM 错误
  }
}

export function createPredictiveLoadingPlugin(
  config: PredictiveLoadingPluginConfig = {}
): LazyImagePlugin {
  const { model = "heuristic", predict, maxPreload = 5, as = "image", crossOrigin = "anonymous" } = config;

  return {
    name: "predictive-loading",
    version: "1.0.0",
    config,
    hooks: {
      // onMount 不返回 Promise，避免与类型定义冲突
      onMount: (context: PluginContext) => {
        try {
          if (predict) {
            Promise.resolve(predict(context))
              .then((candidates) => {
                const list = Array.isArray(candidates) ? candidates.slice(0, maxPreload) : [];
                list.forEach((href) => addPreload(href, as, crossOrigin));
              })
              .catch(() => {
                // 忽略预测错误
              });
          }
        } catch {
          // 忽略预测错误
        }
      },
    },
  };
}