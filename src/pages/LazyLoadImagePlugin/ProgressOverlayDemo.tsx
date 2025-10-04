import {
  LazyLoadImageCore,
  createProgressOverlayPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createProgressOverlayPlugin({ showPercentText: true }),
]);

export default function ProgressOverlayDemo() {
  return (
    <DemoPage
      title="ProgressOverlay 插件示例"
      description="显示加载进度的覆盖层。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/progress-overlay-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
