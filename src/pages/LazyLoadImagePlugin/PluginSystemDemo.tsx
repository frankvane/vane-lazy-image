import {
  LazyLoadImageCore,
  createAltTextPlugin,
  createAspectRatioSpacerPlugin,
  createBadgePlugin,
  createBlurUpPlugin,
  createCachePrewarmPlugin,
  createDominantColorPlugin,
  createErrorBadgePlugin,
  createErrorOverlayPlugin,
  createEventLoggerPlugin,
  createFadeInPlugin,
  createFallbackImagePlugin,
  createFetchLoaderPlugin,
  createIDBCachePlugin,
  createLqipPlugin,
  createMemoryCachePlugin,
  createOverlayInfoPlugin,
  createPreconnectPlugin,
  createPriorityLoadingPlugin,
  createProgressOverlayPlugin,
  createRetryOnErrorPlugin,
  createSkeletonPlugin,
  createWatermarkPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  // 缓存（命中优先返回，避免重复网络请求）
  createMemoryCachePlugin({
    maxEntries: 300,
    ttlMs: 60 * 60 * 1000,
    debug: false,
  }),
  createIDBCachePlugin({ ttlMs: 7 * 24 * 60 * 60 * 1000, debug: false }),
  // 视口预热（进入视口即预取并写入缓存）
  createCachePrewarmPlugin({
    trigger: "enter",
    preferMemory: true,
    debug: false,
  }),
  // 单次请求加载器（带进度）
  createFetchLoaderPlugin({ enabled: true }),
  // 进度叠加层
  createProgressOverlayPlugin({
    showWhen: "loading",
    height: 3,
    color: "#ff0000",
    showPercentText: true,
  }),
  // 骨架屏叠加层（加载时显示）
  createSkeletonPlugin({
    type: "shimmer",
    showWhen: "loading",
    borderRadius: 4,
    zIndex: 1,
  }),
  // 底部信息蒙层（加载时显示）
  createOverlayInfoPlugin({
    content: (ctx) =>
      `Loading • ${new URL(ctx.src, window.location.origin).pathname}`,
    position: "bottom",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    showWhen: "loading",
    zIndex: 4,
  }),
  // 预连接到图片源
  createPreconnectPlugin({ domains: ["https://picsum.photos"] }),
  // LQIP 低清预览（覆盖层显示，加载后隐藏）
  createLqipPlugin({
    lqipSrc: (src) => {
      try {
        const u = new URL(src);
        if (u.hostname.includes("picsum.photos")) {
          // 将 800/600 等尺寸替换为更小的低清版本
          const parts = u.pathname.split("/");
          const last = parts.slice(-2);
          if (last.length === 2 && /\d+/.test(last[0]) && /\d+/.test(last[1])) {
            parts.splice(-2, 2, "40", "30");
            u.pathname = parts.join("/");
            return u.toString();
          }
        }
      } catch {}
      return "/404.jpg"; // 兜底的低清占位
    },
    blur: 12,
    opacity: 0.9,
    zIndex: 2,
  }),
  // Blur-Up 模糊淡出
  createBlurUpPlugin({ startBlur: 6, endBlur: 0, durationMs: 450 }),
  // Fade-In 加载完成淡入
  createFadeInPlugin({ durationMs: 450 }),
  // Dominant Color 背景（从 LQIP 采样或使用默认色）
  createDominantColorPlugin({ lqipSrc: (src) => src }),
  // Aspect-Ratio 空间占位（增强布局稳定性）
  createAspectRatioSpacerPlugin({ ratio: 4 / 3 }),
  // 错误覆盖层（显示提示与重试按钮）
  createErrorOverlayPlugin({ retryText: "重试" }),
  // 错误徽标（Top-Right 红色）
  createErrorBadgePlugin({}),
  // 错误时切换到备用图
  createFallbackImagePlugin({ fallbackSrc: "/404.jpg" }),
  // 错误自动重试（指数退避）
  createRetryOnErrorPlugin({ maxRetries: 1, baseDelayMs: 600, jitter: true }),
  // 事件日志插件（便于观察效果）
  createEventLoggerPlugin({ enabled: true, prefix: "[LLI-Demo]" }),
  // 自动补全 alt 文本
  createAltTextPlugin({ prefix: "Demo" }),
  // 调整加载优先级
  createPriorityLoadingPlugin({ priority: "medium" }),
  // 水印插件
  createWatermarkPlugin({
    text: (src) => `Demo • ${new URL(src, window.location.origin).pathname}`,
    position: "bottom-right",
    opacity: 0.85,
    fontSize: 13,
    color: "#fff",
    offsetX: 10,
    offsetY: 10,
  }),
  // 徽标插件（在加载成功时显示）
  createBadgePlugin({
    text: () => "Loaded",
    position: "top-left",
    bgColor: "rgba(30, 144, 255, 0.75)",
    color: "#fff",
    fontSize: 12,
    padding: "2px 6px",
    borderRadius: 4,
    zIndex: 3,
    showWhen: "loaded",
  }),
]);

export default function PluginSystemDemo() {
  const [images, setImages] = React.useState<string[]>([
    // 故意加入一个错误链接以观察错误插件效果
    "https://invalid.example.com/not-found.jpg",
    // JD 示例图
    "https://img11.360buyimg.com/n1/s720x720_jfs/t1/241589/31/30587/68929/68db47d5Fcbc7a2f7/a70b8f66e17214be.png.avif",
    // Picsum 示例图
    "https://picsum.photos/seed/watermark-demo/800/600",
  ]);

  const addImage = () => {
    const candidates = [
      `https://picsum.photos/seed/watermark-demo-${
        Date.now() % 100000
      }/800/600`,
      "https://img11.360buyimg.com/n1/s720x720_jfs/t1/241589/31/30587/68929/68db47d5Fcbc7a2f7/a70b8f66e17214be.png.avif",
    ];
    const next = candidates[Math.floor(Math.random() * candidates.length)];
    setImages((prev) => [...prev, next]);
  };

  return (
    <DemoPage
      title="LazyLoadImagePlugin • 动态加载示例"
      description="综合演示多个插件的组合效果，包括缓存、加载、错误处理、视觉效果等"
    >
      <div style={{ marginBottom: 12 }}>
        <button onClick={addImage} style={{ padding: "6px 10px" }}>
          添加图片
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
