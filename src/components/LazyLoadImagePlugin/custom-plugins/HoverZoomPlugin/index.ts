import type { LazyImagePlugin } from "../../plugins/types";

export type HoverZoomPluginConfig = {
  scale?: number; // default 1.08
  durationMs?: number; // default 180ms
};

export const createHoverZoomPlugin = (
  config?: HoverZoomPluginConfig
): LazyImagePlugin => {
  const scale = Math.max(1, config?.scale ?? 1.08);
  const duration = Math.max(0, config?.durationMs ?? 180);

  return {
    name: "hover-zoom",
    hooks: {
      onLoadSuccess(context) {
        const img = context.imageRef?.current as any;
        if (!img) return;
        img.style.transition = `transform ${duration}ms ease`;
        const onEnter = () => {
          img.style.transform = `scale(${scale})`;
        };
        const onLeave = () => {
          img.style.transform = "scale(1)";
        };
        img.__lliHoverEnter = onEnter;
        img.__lliHoverLeave = onLeave;
        img.addEventListener("mouseenter", onEnter);
        img.addEventListener("mouseleave", onLeave);
      },
      onUnmount(context) {
        const img = context.imageRef?.current as any;
        if (!img) return;
        const onEnter = img.__lliHoverEnter;
        const onLeave = img.__lliHoverLeave;
        if (onEnter) img.removeEventListener("mouseenter", onEnter);
        if (onLeave) img.removeEventListener("mouseleave", onLeave);
        img.style.transition = "";
        img.style.transform = "";
      },
    },
  };
};

export default createHoverZoomPlugin;