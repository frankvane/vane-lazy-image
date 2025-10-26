import {
  LazyLoadImageCore,
  createHoverPrefetchPlugin,
  createOverlayInfoPlugin,
  createProgressOverlayPlugin,
  createScrollIdlePlugin,
  createSkeletonPlugin,
  createViewportAwarePlugin,
  createViewportDebouncePlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createViewportAwarePlugin(),
  createViewportDebouncePlugin({ debounceMs: 160 }),
  createHoverPrefetchPlugin({
    target: "container",
    trigger: "mouseenter",
    as: "image",
    max: 1,
    dedupe: true,
    getNextSrc: (ctx) => ctx.src,
  }),
  createScrollIdlePlugin({
    idleMs: 160,
    maxWaitMs: 1200,
    onlyWhenIntersecting: true,
  }),
  createProgressOverlayPlugin({
    showWhen: "loading",
    height: 3,
    color: "#4a90e2",
    showPercentText: true,
  }),
  createOverlayInfoPlugin({
    content: (ctx) =>
      `Interact • ${new URL(ctx.src, window.location.origin).pathname}`,
    position: "bottom",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    showWhen: "loading",
    zIndex: 4,
  }),
  createSkeletonPlugin({
    type: "shimmer",
    showWhen: "loading",
    borderRadius: 6,
    zIndex: 1,
  }),
]);

export default function ComboInteractionOverlayDemo() {
  return (
    <DemoPage
      title="组合示例：交互与信息叠层"
      description="组合 ViewportAware/Debounce/HoverPrefetch/ScrollIdle 与 OverlayInfo/ProgressOverlay/Skeleton，优化交互与反馈。"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
        }}
      >
        <div style={{ width: 360, height: 240 }}>
          <LazyImage
            src="https://picsum.photos/seed/interaction-combo-1/800/600"
            loading="lazy"
            containerStyle={{ width: "100%", height: "100%" }}
            imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="交互与叠层组合示例 1"
          />
        </div>
        <div style={{ width: 360, height: 240 }}>
          <LazyImage
            src="https://picsum.photos/seed/interaction-combo-2/800/600"
            loading="lazy"
            containerStyle={{ width: "100%", height: "100%" }}
            imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="交互与叠层组合示例 2"
          />
        </div>
      </div>
    </DemoPage>
  );
}
