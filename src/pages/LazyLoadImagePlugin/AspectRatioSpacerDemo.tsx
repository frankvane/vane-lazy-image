import {
  LazyLoadImageCore,
  createAspectRatioSpacerPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createAspectRatioSpacerPlugin({ ratio: 4 / 3 }),
]);

export default function AspectRatioSpacerDemo() {
  return (
    <DemoPage
      title="AspectRatioSpacer 插件示例"
      description="通过占位维持布局稳定，避免 CLS 波动。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/aspect-ratio-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
