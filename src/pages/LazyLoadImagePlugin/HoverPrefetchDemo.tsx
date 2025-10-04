import {
  LazyLoadImageCore,
  createEventLoggerPlugin,
  createHoverPrefetchPlugin,
  createOverlayInfoPlugin,
  createPreconnectPlugin,
  createProgressOverlayPlugin,
  createSkeletonPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const IMAGES = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=640&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=640&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=640&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=640&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=640&auto=format&fit=crop",
];

function nextCandidate(currentSrc: string): string | undefined {
  const idx = IMAGES.findIndex((s) => s === currentSrc);
  if (idx < 0) return IMAGES[0];
  const next = IMAGES[(idx + 1) % IMAGES.length];
  return next;
}

const plugins = [
  createPreconnectPlugin({ domains: ["https://picsum.photos"] }),
  createSkeletonPlugin({
    type: "shimmer",
    showWhen: "loading",
    borderRadius: 6,
    zIndex: 1,
  }),
  createProgressOverlayPlugin({
    showWhen: "loading",
    height: 3,
    color: "#ff7f50",
    showPercentText: true,
  }),
  createOverlayInfoPlugin({
    content: (ctx) =>
      `HoverPrefetch • ${new URL(ctx.src, window.location.origin).pathname}`,
    position: "bottom",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    showWhen: "loading",
    zIndex: 4,
  }),
  createHoverPrefetchPlugin({
    target: "container",
    trigger: "mouseenter",
    as: "image",
    max: 1,
    dedupe: true,
    getNextSrc: (ctx) => nextCandidate(ctx.src) || ctx.src,
    debug: false,
  }),
  createEventLoggerPlugin({ enabled: true, prefix: "[HoverPrefetch]" }),
];

const LazyImage = withPlugins(LazyLoadImageCore as any, plugins);

export default function HoverPrefetchDemo() {
  return (
    <DemoPage
      title="HoverPrefetch 示例"
      description="将鼠标或触控悬停在图片容器上，插件会预加载下一张候选图片以降低交互延迟。"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {IMAGES.map((src, i) => (
          <div
            key={`hp-${i}`}
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "66%",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ position: "absolute", inset: 0 }}>
              <LazyImage src={src} alt={`hover-prefetch-${i}`} />
            </div>
          </div>
        ))}
      </div>
    </DemoPage>
  );
}
