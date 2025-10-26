import {
  LazyLoadImageCore,
  createPriorityLoadingPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createPriorityLoadingPlugin({ priority: "high" }),
]);

export default function PriorityLoadingDemo() {
  return (
    <DemoPage
      title="PriorityLoading 插件示例"
      description="调整图片加载优先级以影响调度。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/priority-loading-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
