import {
  LazyLoadImageCore,
  createEventLoggerPlugin,
  createFetchLoaderPlugin,
  createIDBCachePlugin,
  createMemoryCachePlugin,
  createOverlayInfoPlugin,
  createPreconnectPlugin,
  createProgressOverlayPlugin,
  createScrollIdlePlugin,
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
  // 滚动空闲调度（进入视口后等待空闲，最长等待 1.2s）
  createScrollIdlePlugin({
    idleMs: 160,
    maxWaitMs: 1200,
    onlyWhenIntersecting: true,
    debug: false,
  }),
  // 单次请求加载器（带进度）
  createFetchLoaderPlugin({ enabled: true }),
  // 进度与骨架
  createProgressOverlayPlugin({
    showWhen: "loading",
    height: 3,
    color: "#ff7f50",
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
      `ScrollIdle • ${new URL(ctx.src, window.location.origin).pathname}`,
    position: "bottom",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    showWhen: "loading",
    zIndex: 4,
  }),
  // 预连接到图片源
  createPreconnectPlugin({ domains: ["https://picsum.photos"] }),
  // 事件日志
  createEventLoggerPlugin({ enabled: true, prefix: "[SI-Demo]" }),
]);

export default function ScrollIdleDemo() {
  const [images, setImages] = React.useState<string[]>(
    Array.from({ length: 90 }).map(
      (_, i) => `https://picsum.photos/seed/si-demo-${i + 1}/800/600`
    )
  );

  const addBatch = () => {
    const next = Array.from({ length: 10 }).map(
      (_, i) => `https://picsum.photos/seed/si-demo-${Date.now()}-${i}/800/600`
    );
    setImages((prev) => [...prev, ...next]);
  };

  return (
    <DemoPage
      title="LazyLoadImagePlugin • 滚动空闲示例"
      description="滚动页面，加载将等待空闲以提升流畅度"
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
