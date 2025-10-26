import {
  LazyLoadImageCore,
  createCropPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createCropPlugin({ focusPoint: { x: 0.3, y: 0.4 } }),
]);

export default function CropDemo() {
  const srcs = [
    "https://picsum.photos/seed/crop-1/800/600",
    "https://picsum.photos/seed/crop-2/800/600",
  ];
  return (
    <DemoPage
      title="Crop 插件示例"
      description="通过 objectPosition 模拟裁剪焦点。"
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
              alt={`Crop ${i + 1}`}
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
