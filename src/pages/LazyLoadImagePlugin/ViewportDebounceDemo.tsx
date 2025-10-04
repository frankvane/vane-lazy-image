import {
  LazyLoadImageCore,
  createViewportDebouncePlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createViewportDebouncePlugin({
    debounceMs: 200,
    onlyWhenIntersecting: true,
    debug: true,
  }),
]);

export default function ViewportDebounceDemo() {
  const srcs = [
    "https://picsum.photos/seed/viewport-debounce-1/800/600",
    "https://picsum.photos/seed/viewport-debounce-2/800/600",
    "https://picsum.photos/seed/viewport-debounce-3/800/600",
  ];
  return (
    <DemoPage
      title="ViewportDebounce 插件示例"
      description="快速滚动下抑制抖动事件，仅在稳定进入视口后标记。"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 12,
        }}
      >
        {srcs.map((src, i) => (
          <div key={src + i} style={{ width: 320, height: 200 }}>
            <LazyImage
              src={src}
              alt={`ViewportDebounce ${i + 1}`}
              loading="lazy"
              rootMargin="300px"
              containerStyle={{ width: "100%", height: "100%" }}
              imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </DemoPage>
  );
}
