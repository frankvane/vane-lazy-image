import {
  LazyLoadImageCore,
  createErrorBadgePlugin,
  createErrorOverlayPlugin,
  createEventLoggerPlugin,
  createFallbackImagePlugin,
  createRetryOnErrorPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createErrorOverlayPlugin({ retryText: "重试" }),
  createErrorBadgePlugin({}),
  createFallbackImagePlugin({ fallbackSrc: "/404.jpg" }),
  createRetryOnErrorPlugin({ maxRetries: 1 }),
  createEventLoggerPlugin({ enabled: true }),
]);

export default function ComboErrorResilienceDemo() {
  return (
    <DemoPage
      title="组合示例：错误韧性"
      description="结合错误覆盖层、错误徽标、备用图与自动重试，提升失败处理体验。"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
        }}
      >
        <div style={{ width: 360, height: 240 }}>
          <LazyImage
            src="https://invalid.example.com/not-found.jpg"
            loading="lazy"
            containerStyle={{ width: "100%", height: "100%" }}
            imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="错误触发示例"
          />
        </div>
        <div style={{ width: 360, height: 240 }}>
          <LazyImage
            src="https://picsum.photos/seed/error-combo/800/600"
            loading="lazy"
            containerStyle={{ width: "100%", height: "100%" }}
            imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="正常加载示例"
          />
        </div>
      </div>
    </DemoPage>
  );
}
