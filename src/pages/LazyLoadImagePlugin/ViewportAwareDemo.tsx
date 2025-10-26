import {
  LazyLoadImageCore,
  createViewportAwarePlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createViewportAwarePlugin({
    showDot: true,
    dotPosition: "bottom-right",
    hideWhenOut: true,
  }),
]);

export default function ViewportAwareDemo() {
  return (
    <DemoPage
      title="ViewportAware 插件示例"
      description="显示一个指示点来标识图片是否在视口内。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/viewport-aware/800/600"
          loading="lazy"
          rootMargin="200px"
          unobserveOnVisible={false}
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      {/* 为了更明确地区分视口状态，将间距增至 1600px，且第二张图 rootMargin 设为 0px */}
      <div style={{ height: 1600 }} />
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/viewport-aware-2/800/600"
          loading="lazy"
          rootMargin="0px"
          unobserveOnVisible={false}
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
