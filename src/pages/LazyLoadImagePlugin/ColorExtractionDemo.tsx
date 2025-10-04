import {
  LazyLoadImageCore,
  createColorExtractionPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createColorExtractionPlugin({
    setContainerBg: true,
    sampleSize: 4,
    showOverlay: true,
  }),
]);

export default function ColorExtractionDemo() {
  const srcs = [
    "https://picsum.photos/seed/cc-demo-1/800/600",
    "https://picsum.photos/seed/cc-demo-2/800/600",
    "https://picsum.photos/seed/cc-demo-3/800/600",
  ];
  return (
    <DemoPage
      title="ColorExtraction 插件示例"
      description="加载后右上角显示主色卡，容器背景使用主色渐变。"
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
              alt={`ColorExtraction ${i + 1}`}
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
