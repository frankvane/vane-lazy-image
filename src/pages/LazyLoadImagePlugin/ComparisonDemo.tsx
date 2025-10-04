import {
  LazyLoadImageCore,
  createComparisonPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createComparisonPlugin(),
]);

export default function ComparisonDemo() {
  const srcs = [
    "https://picsum.photos/seed/comp-1/800/600",
    "https://picsum.photos/seed/comp-2/800/600",
  ];
  return (
    <DemoPage
      title="Comparison 插件示例"
      description="最小实现的对比插件，后续可扩展滑块或并排展示。"
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
              alt={`Comparison ${i + 1}`}
              loading="lazy"
              rootMargin="300px"
              containerStyle={{
                width: "100%",
                height: "100%",
                position: "relative",
              }}
              imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </DemoPage>
  );
}
