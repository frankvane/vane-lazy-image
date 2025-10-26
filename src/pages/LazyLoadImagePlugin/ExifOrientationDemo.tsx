import {
  LazyLoadImageCore,
  createExifOrientationPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createExifOrientationPlugin(),
]);

export default function ExifOrientationDemo() {
  return (
    <DemoPage
      title="ExifOrientation 插件示例"
      description="基于 EXIF 的方向信息自动调整显示方向（浏览器支持时生效）。"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {["exif-1", "exif-2", "exif-3"].map((seed) => (
          <div key={seed} style={{ width: 360, height: 360 }}>
            <LazyImage
              src={`https://picsum.photos/seed/${seed}/800/800`}
              loading="lazy"
              containerStyle={{ width: "100%", height: "100%" }}
              imageStyle={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        ))}
      </div>
    </DemoPage>
  );
}
