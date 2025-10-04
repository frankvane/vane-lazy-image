import {
  LazyLoadImageCore,
  createMemoryPressureAbortPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createMemoryPressureAbortPlugin({ deviceMemoryThreshold: 4, lowWidth: 480 }),
]);

export default function MemoryPressureAbortDemo() {
  return (
    <DemoPage
      title="MemoryPressureAbort 插件示例"
      description="在低内存/省流/移动端条件下自动降级清晰度，避免浪费。"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ width: 360, height: 240 }}>
            <LazyImage
              src={`https://picsum.photos/seed/cdn-fallback-demo-${i}/800/600`}
              loading="lazy"
              containerStyle={{ width: "100%", height: "100%" }}
              imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </DemoPage>
  );
}
