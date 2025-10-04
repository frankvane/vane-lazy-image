import {
  LazyLoadImageCore,
  createErrorOverlayPlugin,
  createErrorTrackingPlugin,
  createRetryOnErrorPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createErrorTrackingPlugin({ showBadge: true }),
  createErrorOverlayPlugin({ retryText: "重试" }),
  createRetryOnErrorPlugin({ maxRetries: 1, baseDelayMs: 600 }),
]);

export default function ErrorTrackingDemo() {
  return (
    <DemoPage
      title="ErrorTracking 插件示例"
      description="错误发生时计数并显示徽标，提供覆盖层重试与自动重试。"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 12,
        }}
      >
        <div style={{ width: 320, height: 200 }}>
          <LazyImage
            src="https://invalid.example.com/not-found.jpg"
            containerStyle={{ width: "100%", height: "100%" }}
            imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div style={{ width: 320, height: 200 }}>
          <LazyImage
            src="https://picsum.photos/seed/error-demo/800/600"
            containerStyle={{ width: "100%", height: "100%" }}
            imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </DemoPage>
  );
}
