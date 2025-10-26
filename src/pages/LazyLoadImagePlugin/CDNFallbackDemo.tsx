import {
  LazyLoadImageCore,
  createCDNFallbackPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createCDNFallbackPlugin({
    cdnBases: ["https://invalid.example.com", "https://picsum.photos"],
  }),
]);

export default function CDNFallbackDemo() {
  return (
    <DemoPage
      title="CDNFallback 插件示例"
      description="当主 CDN 加载失败时自动切换到备用 CDN。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/cdn-fallback-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
