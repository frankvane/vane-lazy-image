import {
  LazyLoadImageCore,
  createOverlayInfoPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createOverlayInfoPlugin({
    content: () => "Loading",
    position: "bottom",
    showWhen: "loading",
  }),
]);

export default function OverlayInfoDemo() {
  return (
    <DemoPage
      title="OverlayInfo 插件示例"
      description="在图片上方叠加信息蒙层。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/overlay-info-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
