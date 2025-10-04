import {
  LazyLoadImageCore,
  createGalleryPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createGalleryPlugin(),
]);

export default function GalleryDemo() {
  return (
    <DemoPage
      title="Gallery 插件示例"
      description="为图片提供画廊/灯箱体验的基础集成。"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{ width: 180, height: 120 }}>
            <LazyImage
              src={`https://picsum.photos/seed/gallery-${i}/600/400`}
              loading="lazy"
              containerStyle={{ width: "100%", height: "100%" }}
              imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt={`图片 ${i}`}
            />
          </div>
        ))}
      </div>
    </DemoPage>
  );
}
