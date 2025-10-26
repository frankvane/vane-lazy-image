import {
  LazyLoadImageCore,
  createBlurUpPlugin,
  createBorderGlowPlugin,
  createCaptionPlugin,
  createFilterPlugin,
  createGalleryPlugin,
  createHoverZoomPlugin,
  createSkeletonPlugin,
  createSvgPlaceholderPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createSvgPlaceholderPlugin({
    svgContent: `<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e5e7eb"/><stop offset="50%" stop-color="#f3f4f6"/><stop offset="100%" stop-color="#e5e7eb"/></linearGradient></defs><rect x="0" y="0" width="120" height="90" fill="#f3f4f6" rx="8"/><circle cx="60" cy="40" r="18" fill="url(#grad)"><animate attributeName="r" values="14;18;14" dur="1.2s" repeatCount="indefinite" /></circle><rect x="36" y="30" width="48" height="20" rx="4" fill="#e5e7eb" opacity="0.6" /><text x="60" y="76" text-anchor="middle" font-size="10" fill="#9ca3af">Loading…</text></svg>`,
    background: "transparent",
    showWhen: "loading",
    zIndex: 4,
    fadeOutOnLoaded: true,
    opacity: 1,
  }),
  createBlurUpPlugin({ startBlur: 8, endBlur: 0, durationMs: 450 }),
  createSkeletonPlugin({
    type: "shimmer",
    showWhen: "loading",
    borderRadius: 8,
    zIndex: 1,
  }),
  createFilterPlugin({ filter: "grayscale", amount: 1, hover: true }),
  createHoverZoomPlugin({ scale: 1.12, durationMs: 180 }),
  createBorderGlowPlugin({
    color: "rgba(0,153,255,0.6)",
    blurPx: 12,
    spreadPx: 2,
  }),
  createCaptionPlugin({ text: "视觉增强组合（Plus）", position: "bottom" }),
  createGalleryPlugin({ buttonText: "Open", enableLightbox: true }),
]);

export default function ComboVisualEffectsPlusDemo() {
  return (
    <DemoPage
      title="组合示例：视觉增强 Plus"
      description="结合 SVG 占位、Blur-Up、Skeleton、Filter、HoverZoom、BorderGlow、Caption 与 Gallery。"
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
            src="https://picsum.photos/seed/visual-plus-1/800/600"
            loading="lazy"
            containerStyle={{ width: "100%", height: "100%" }}
            imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="视觉效果 Plus 示例 1"
          />
        </div>
        <div style={{ width: 360, height: 240 }}>
          <LazyImage
            src="https://picsum.photos/seed/visual-plus-2/800/600"
            loading="lazy"
            containerStyle={{ width: "100%", height: "100%" }}
            imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="视觉效果 Plus 示例 2"
          />
        </div>
      </div>
    </DemoPage>
  );
}
