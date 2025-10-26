import {
  LazyLoadImageCore,
  createCaptionPlugin,
  createWatermarkPlugin,
  withPlugins,
} from "../../components/LazyLoadImagePlugin";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createWatermarkPlugin({
    text: "VANE",
    position: "bottom-right",
    opacity: 0.6,
  }),
  createCaptionPlugin({
    text: "Caption",
    position: "bottom",
    color: "white",
  }),
]);

export default function WatermarkDemo() {
  return (
    <DemoPage
      title="Watermark & Caption 插件示例"
      description="在图片上叠加半透明水印以及标题展示，目前是2个插件叠加使用"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/id/30/800/600"
          isLCP={true} // Issue #0: 标记为 LCP 图片
          loading="eager" // Issue #0: 首屏图片使用 eager
          fetchPriority="high" // Issue #0: 高优先级
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
