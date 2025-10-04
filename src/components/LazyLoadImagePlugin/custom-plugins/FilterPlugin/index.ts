import type { LazyImagePlugin } from "../../plugins/types";

/**
 * Filter plugin configuration
 * - filter: filter type, one of
 *   - none | grayscale | sepia | brightness | contrast | saturate
 * - amount: intensity. 0..1 for grayscale/sepia; >=1 for brightness/contrast/saturate
 * - hover: when true, remove filter on mouseenter and restore on mouseleave
 */
export type FilterPluginConfig = {
  filter?:
    | "none"
    | "grayscale"
    | "sepia"
    | "brightness"
    | "contrast"
    | "saturate";
  amount?: number;
  hover?: boolean;
};

function buildFilter(config?: FilterPluginConfig): string {
  const type = config?.filter ?? "none";
  const amt = config?.amount ?? (type === "none" ? 1 : type === "brightness" ? 1 : type === "contrast" ? 1 : type === "saturate" ? 1 : 1);
  switch (type) {
    case "none":
      return "none";
    case "grayscale":
      return `grayscale(${Math.max(0, Math.min(1, amt))})`;
    case "sepia":
      return `sepia(${Math.max(0, Math.min(1, amt))})`;
    case "brightness":
      return `brightness(${amt})`;
    case "contrast":
      return `contrast(${amt})`;
    case "saturate":
      return `saturate(${amt})`;
    default:
      return "none";
  }
}

export const createFilterPlugin = (
  config?: FilterPluginConfig
): LazyImagePlugin => {
  const filterStr = buildFilter(config);
  const hover = !!config?.hover;

  return {
    name: "filter",
    hooks: {
      onLoadSuccess(context) {
        const img = context.imageRef?.current as any;
        if (!img) return;
        img.style.filter = filterStr;
        if (hover && filterStr !== "none") {
          const onEnter = () => {
            img.style.filter = "none";
          };
          const onLeave = () => {
            img.style.filter = filterStr;
          };
          img.__lliFilterEnter = onEnter;
          img.__lliFilterLeave = onLeave;
          img.addEventListener("mouseenter", onEnter);
          img.addEventListener("mouseleave", onLeave);
        }
      },
      onUnmount(context) {
        const img = context.imageRef?.current as any;
        if (!img) return;
        const onEnter = img.__lliFilterEnter;
        const onLeave = img.__lliFilterLeave;
        if (onEnter) img.removeEventListener("mouseenter", onEnter);
        if (onLeave) img.removeEventListener("mouseleave", onLeave);
        img.style.filter = "";
      },
    },
  };
};

export default createFilterPlugin;

// Preset configurations for quick usage in demos
export const FILTER_PRESETS: Record<string, FilterPluginConfig> = {
  grayscaleSoft: { filter: "grayscale", amount: 0.6, hover: true },
  sepiaWarm: { filter: "sepia", amount: 0.5 },
  brightBoost: { filter: "brightness", amount: 1.2 },
  contrastPunch: { filter: "contrast", amount: 1.3 },
  saturateVivid: { filter: "saturate", amount: 1.4 },
};