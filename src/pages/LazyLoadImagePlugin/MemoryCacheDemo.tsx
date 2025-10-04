import {
  LazyLoadImageCore,
  createFetchLoaderPlugin,
  createMemoryCachePlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createMemoryCachePlugin({ maxEntries: 200, ttlMs: 60 * 60 * 1000 }),
  createFetchLoaderPlugin({ enabled: true }),
]);

export default function MemoryCacheDemo() {
  return (
    <DemoPage
      title="内存缓存插件示例"
      description="命中内存缓存时快速返回，减少重复请求。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/memory-cache-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
