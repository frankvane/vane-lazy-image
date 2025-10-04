import {
  LazyLoadImageCore,
  createRetryOnErrorPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createRetryOnErrorPlugin({ maxRetries: 3, baseDelayMs: 800 }),
]);

export default function RetryOnErrorDemo() {
  return (
    <DemoPage
      title="RetryOnError 插件示例"
      description="加载失败时进行指数退避重试。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://invalid.domain.example/should-fail.jpg"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
