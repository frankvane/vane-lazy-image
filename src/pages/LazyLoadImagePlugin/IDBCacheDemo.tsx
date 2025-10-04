import {
  LazyLoadImageCore,
  createFetchLoaderPlugin,
  createIDBCachePlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createIDBCachePlugin({ ttlMs: 7 * 24 * 60 * 60 * 1000 }),
  createFetchLoaderPlugin({ enabled: true }),
]);

export default function IDBCacheDemo() {
  return (
    <DemoPage
      title="IDB 缓存插件示例"
      description="使用 IndexedDB 持久缓存图片资源。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/idb-cache-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
