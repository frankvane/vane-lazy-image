import {
  LazyLoadImageCore,
  createOfflinePlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createOfflinePlugin(),
]);

export default function OfflineDemo() {
  const srcs = [
    "https://picsum.photos/seed/offline-1/800/600",
    "https://picsum.photos/seed/offline-2/800/600",
  ];
  return (
    <DemoPage
      title="Offline 插件示例"
      description="显示 saveData 状态，后续可扩展为离线策略。"
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
              alt={`Offline ${i + 1}`}
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
