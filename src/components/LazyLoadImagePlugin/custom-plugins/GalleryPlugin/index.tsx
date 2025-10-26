import React from "react";
import type { LazyImagePlugin } from "../../plugins/types";

export type GalleryPluginConfig = {
  buttonText?: string;
  enableLightbox?: boolean;
  overlayZIndex?: number;
};

export const createGalleryPlugin = (
  config?: GalleryPluginConfig
): LazyImagePlugin => {
  const buttonText = config?.buttonText ?? "Open";
  const enableLightbox = config?.enableLightbox ?? true;
  const overlayZIndex = config?.overlayZIndex ?? 10;

  return {
    name: "gallery",
    hooks: {
      renderOverlay(context) {
        const Overlay: React.FC = () => {
          const [open, setOpen] = React.useState(false);
          const [hover, setHover] = React.useState(false);
          const openAction = () => {
            if (enableLightbox) {
              setOpen(true);
            } else {
              const src = context.src ?? "";
              if (src) window.open(src, "_blank");
            }
          };
          React.useEffect(() => {
            const onKey = (e: KeyboardEvent) => {
              if (e.key === "Escape") setOpen(false);
            };
            window.addEventListener("keydown", onKey);
            return () => window.removeEventListener("keydown", onKey);
          }, []);
          return (
            <>
              {/* 覆盖层：允许点击任意区域打开 */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: overlayZIndex,
                  pointerEvents: "auto",
                  background: hover ? "rgba(0,0,0,0.08)" : "transparent",
                  transition: "background 160ms ease",
                }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={(e) => {
                  e.stopPropagation();
                  openAction();
                }}
              />
              {/* 右上角按钮：更高对比度与尺寸 */}
              <button
                type="button"
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: overlayZIndex + 1,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: "rgba(0,0,0,0.65)",
                  color: "#fff",
                  fontSize: 13,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  openAction();
                }}
              >
                {buttonText}
              </button>
              {enableLightbox && open ? (
                <div
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.85)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    cursor: "zoom-out",
                  }}
                  onClick={() => setOpen(false)}
                >
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <img src={context.src ?? ""} style={{ maxWidth: "90%", maxHeight: "90%" }} />
                </div>
              ) : null}
            </>
          );
        };
        return <Overlay />;
      },
    },
  };
};

export default createGalleryPlugin;