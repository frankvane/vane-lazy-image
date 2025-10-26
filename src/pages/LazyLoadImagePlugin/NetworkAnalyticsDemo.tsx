import {
  LazyLoadImageCore,
  createNetworkAnalyticsPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createNetworkAnalyticsPlugin({
    reportEndpoint: undefined, // 演示中仅打印，不真实上报
    trackCDN: true,
    report: (event: string, payload: Record<string, any>) => {
      // 在控制台查看上报事件
      // eslint-disable-next-line no-console
      console.log("[NetworkAnalytics]", event, payload);
    },
  }),
]);

export default function NetworkAnalyticsDemo() {
  const srcs = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1280&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1280&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1280&auto=format&fit=crop",
  ];

  return (
    <DemoPage
      title="NetworkAnalytics 插件示例"
      description="在图片生命周期事件中上报信息（控制台可查看）。"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 12,
        }}
      >
        {srcs.map((src, i) => (
          <div key={src + i} style={{ width: 320, height: 200 }}>
            <LazyImage
              src={src}
              alt={`Analytics ${i + 1}`}
              loading="lazy"
              rootMargin="300px"
              containerStyle={{ width: "100%", height: "100%" }}
              imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </DemoPage>
  );
}
