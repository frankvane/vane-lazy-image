import {
  LazyLoadImageCore,
  createErrorBadgePlugin,
  createFallbackImagePlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createErrorBadgePlugin({}),
  createFallbackImagePlugin({ fallbackSrc: "/404.jpg" }),
]);

export default function ErrorBadgeDemo() {
  return (
    <DemoPage
      title="ErrorBadge 插件示例"
      description="加载失败时在角标显示错误提示。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://invalid.example.com/not-found.jpg"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
