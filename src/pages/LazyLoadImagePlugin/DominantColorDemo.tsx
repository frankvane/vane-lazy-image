import {
  LazyLoadImageCore,
  createDominantColorPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createDominantColorPlugin({}),
]);

export default function DominantColorDemo() {
  return (
    <DemoPage
      title="DominantColor 插件示例"
      description="根据图片主色设置背景，提升过渡观感。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/dominant-color-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
