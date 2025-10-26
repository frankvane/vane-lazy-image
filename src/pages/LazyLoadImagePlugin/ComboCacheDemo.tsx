import {
  LazyLoadImageCore,
  createCachePrewarmPlugin,
  createIDBCachePlugin,
  createMemoryCachePlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createMemoryCachePlugin({ maxEntries: 200 }),
  createIDBCachePlugin({}),
  createCachePrewarmPlugin({ trigger: "enter", preferMemory: true }),
]);

export default function ComboCacheDemo() {
  return (
    <DemoPage
      title="组合示例：缓存与存储"
      description="结合内存缓存、IDB 缓存与视口预热，降低重复请求与提升体验。"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
        }}
      >
        <div style={{ width: 360, height: 240 }}>
          <LazyImage
            src="https://picsum.photos/seed/cache-combo-1/800/600"
            loading="lazy"
            containerStyle={{ width: "100%", height: "100%" }}
            imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="缓存组合示例 1"
          />
        </div>
        <div style={{ width: 360, height: 240 }}>
          <LazyImage
            src="https://picsum.photos/seed/cache-combo-2/800/600"
            loading="lazy"
            containerStyle={{ width: "100%", height: "100%" }}
            imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="缓存组合示例 2"
          />
        </div>
      </div>
    </DemoPage>
  );
}
