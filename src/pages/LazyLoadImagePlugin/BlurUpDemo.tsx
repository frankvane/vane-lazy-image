import {
  LazyLoadImageCore,
  createBlurUpPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createBlurUpPlugin({ startBlur: 8, endBlur: 0, durationMs: 500 }),
]);

export default function BlurUpDemo() {
  return (
    <DemoPage
      title="BlurUp 插件示例"
      description="加载阶段模糊，完成后快速淡出清晰。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/blur-up-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
