import {
  LazyLoadImageCore,
  createSkeletonPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createSkeletonPlugin({ type: "shimmer" }),
]);

export default function SkeletonDemo() {
  return (
    <DemoPage title="Skeleton 插件示例" description="在加载阶段显示骨架占位。">
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/skeleton-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
