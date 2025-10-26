import {
  LazyLoadImageCore,
  createConcurrencyControlPlugin,
  createEventLoggerPlugin,
  createFetchLoaderPlugin,
  createIDBCachePlugin,
  createMemoryCachePlugin,
  createOverlayInfoPlugin,
  createPreconnectPlugin,
  createProgressOverlayPlugin,
  createSkeletonPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  // 命中优先返回，减少重复请求
  createMemoryCachePlugin({
    maxEntries: 300,
    ttlMs: 60 * 60 * 1000,
    debug: false,
  }),
  createIDBCachePlugin({ ttlMs: 7 * 24 * 60 * 60 * 1000, debug: false }),
  // 并发控制（自适应网络，按域分片，超时保护）
  createConcurrencyControlPlugin({
    maxConcurrent: 4,
    adaptive: true,
    scope: "perHost",
    acquireTimeoutMs: 6000,
    debug: false,
  }),
  // 单次请求加载器（带进度）
  createFetchLoaderPlugin({ enabled: true }),
  // 进度与骨架
  createProgressOverlayPlugin({
    showWhen: "loading",
    height: 3,
    color: "#1e90ff",
    showPercentText: true,
  }),
  createSkeletonPlugin({
    type: "shimmer",
    showWhen: "loading",
    borderRadius: 6,
    zIndex: 1,
  }),
  // 底部信息蒙层（加载时显示）
  createOverlayInfoPlugin({
    content: (ctx) =>
      `Concurrency • ${new URL(ctx.src, window.location.origin).hostname}`,
    position: "bottom",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    showWhen: "loading",
    zIndex: 4,
  }),
  // 预连接到图片源
  createPreconnectPlugin({ domains: ["https://picsum.photos"] }),
  // 事件日志
  createEventLoggerPlugin({ enabled: true, prefix: "[CC-Demo]" }),
]);

export default function ConcurrencyDemo() {
  const [images, setImages] = React.useState<string[]>(
    Array.from({ length: 90 }).map(
      (_, i) => `https://picsum.photos/seed/cc-demo-${i + 1}/800/600`
    )
  );

  const addBatch = () => {
    const next = Array.from({ length: 6 }).map(
      (_, i) => `https://picsum.photos/seed/cc-demo-${Date.now()}-${i}/800/600`
    );
    setImages((prev) => [...prev, ...next]);
  };

  return (
    <DemoPage
      title="LazyLoadImagePlugin • 并发控制示例"
      description="控制并发加载数量，优化大量图片加载性能"
    >
      <div style={{ marginBottom: 12 }}>
        <button onClick={addBatch} style={{ padding: "6px 10px" }}>
          批量添加图片
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 12,
        }}
      >
        {images.map((src, idx) => (
          <div
            key={src + idx}
            style={{ width: 320, height: 200, position: "relative" }}
          >
            <LazyImage
              src={src}
              loading="lazy"
              rootMargin="300px"
              containerStyle={{ width: "100%", height: "100%" }}
              imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
              containerClassName="lazy-image-container"
            />
          </div>
        ))}
      </div>
    </DemoPage>
  );
}
