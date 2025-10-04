import {
  LazyLoadImageCore,
  createImageOptimizationPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createImageOptimizationPlugin({
    maxWidth: 1280,
    quality: 0.8,
    format: "auto",
    widthParam: "w",
    qualityParam: "q",
    formatParam: "format",
  }),
]);

export default function ImageOptimizationDemo() {
  const srcs = [
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1280&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1280&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1280&auto=format&fit=crop",
  ];

  return (
    <DemoPage
      title="ImageOptimization 插件示例"
      description="根据视口与 DPR，自动在图片 URL 中追加宽度与质量参数。"
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
              alt={`Optimization ${i + 1}`}
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
