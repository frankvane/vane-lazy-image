import {
  LazyLoadImageCore,
  createBlurUpPlugin,
  createBorderGlowPlugin,
  createCaptionPlugin,
  createFadeInPlugin,
  createWatermarkPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createBlurUpPlugin({ startBlur: 6, endBlur: 0, durationMs: 450 }),
  createFadeInPlugin({ durationMs: 450 }),
  createBorderGlowPlugin({}),
  createCaptionPlugin({ text: "组合示例：视觉与效果" }),
  createWatermarkPlugin({
    text: "DEMO",
    position: "bottom-right",
    opacity: 0.6,
  }),
]);

export default function ComboVisualEffectsDemo() {
  return (
    <DemoPage
      title="组合示例：视觉与效果"
      description="组合 Blur-Up、Fade-In、边框辉光、说明文字与水印效果。"
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
            src="https://picsum.photos/seed/visual-combo-1/800/600"
            loading="lazy"
            containerStyle={{ width: "100%", height: "100%" }}
            imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="视觉效果示例 1"
          />
        </div>
        <div style={{ width: 360, height: 240 }}>
          <LazyImage
            src="https://picsum.photos/seed/visual-combo-2/800/600"
            loading="lazy"
            containerStyle={{ width: "100%", height: "100%" }}
            imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="视觉效果示例 2"
          />
        </div>
      </div>
    </DemoPage>
  );
}
