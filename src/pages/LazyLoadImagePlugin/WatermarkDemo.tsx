import {
  LazyLoadImageCore,
  createWatermarkPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createWatermarkPlugin({
    text: "VANE",
    position: "bottom-right",
    opacity: 0.6,
  }),
]);

export default function WatermarkDemo() {
  return (
    <DemoPage title="Watermark 插件示例" description="在图片上叠加半透明水印。">
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/watermark-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
