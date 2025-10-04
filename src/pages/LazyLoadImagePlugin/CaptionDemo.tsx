import {
  LazyLoadImageCore,
  createCaptionPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createCaptionPlugin({
    text: "Caption 插件示例",
  }),
]);

export default function CaptionDemo() {
  return (
    <DemoPage
      title="Caption 插件示例"
      description="在图片下方显示说明文字或标题。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/caption-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt="城市街景"
        />
      </div>
    </DemoPage>
  );
}
