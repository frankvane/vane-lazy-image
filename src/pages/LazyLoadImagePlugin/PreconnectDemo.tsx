import {
  LazyLoadImageCore,
  createPreconnectPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createPreconnectPlugin({ domains: ["https://picsum.photos"] }),
]);

export default function PreconnectDemo() {
  return (
    <DemoPage
      title="Preconnect 插件示例"
      description="预连接到图片源，降低首包延迟。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/preconnect-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
