import {
  LazyLoadImageCore,
  createFetchLoaderPlugin,
  createPerformanceMonitorPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createFetchLoaderPlugin({ enabled: true }),
  createPerformanceMonitorPlugin({
    showOverlay: true,
    overlayPosition: "top-right",
  }),
]);

export default function PerformanceMonitorDemo() {
  return (
    <DemoPage
      title="PerformanceMonitor 插件示例"
      description="展示图片加载耗时的叠加层，并通过插件总线记录基础数据。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/perf-monitor/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
