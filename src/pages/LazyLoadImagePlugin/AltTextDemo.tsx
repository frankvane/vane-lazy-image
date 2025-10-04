import {
  LazyLoadImageCore,
  createAltTextPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createAltTextPlugin({ prefix: "Demo" }),
]);

export default function AltTextDemo() {
  return (
    <DemoPage
      title="AltText 插件示例"
      description="自动补全 alt 文本，便于无障碍与 SEO。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/alt-text-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
