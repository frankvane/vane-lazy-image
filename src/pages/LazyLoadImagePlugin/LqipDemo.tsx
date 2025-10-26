import {
  LazyLoadImageCore,
  createLqipPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createLqipPlugin({ blur: 10, opacity: 0.85 }),
]);

export default function LqipDemo() {
  return (
    <DemoPage
      title="LQIP 插件示例"
      description="低清预览覆盖层，加载后自动隐藏。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/lqip-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
