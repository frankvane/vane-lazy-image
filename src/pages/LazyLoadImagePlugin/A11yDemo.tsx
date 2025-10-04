import {
  LazyLoadImageCore,
  createA11yPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [createA11yPlugin()]);

export default function A11yDemo() {
  return (
    <DemoPage
      title="A11y 插件示例"
      description="为图片增强可访问性属性，如更友好的 alt/tab 体验。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/a11y-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt="风景图片"
        />
      </div>
    </DemoPage>
  );
}
