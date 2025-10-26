import {
  LazyLoadImageCore,
  createBadgePlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createBadgePlugin({ text: () => "Loaded", position: "top-left" }),
]);

export default function BadgeDemo() {
  return (
    <DemoPage title="Badge 插件示例" description="在加载成功时显示角标。">
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/badge-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
