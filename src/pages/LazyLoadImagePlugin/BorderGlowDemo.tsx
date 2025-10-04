import {
  LazyLoadImageCore,
  createBorderGlowPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createBorderGlowPlugin(),
]);

export default function BorderGlowDemo() {
  return (
    <DemoPage
      title="BorderGlow 插件示例"
      description="为图片容器添加柔和发光边框效果。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/border-glow-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
