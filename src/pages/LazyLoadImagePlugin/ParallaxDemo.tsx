import {
  LazyLoadImageCore,
  createParallaxPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  // 提高强度，效果更明显
  createParallaxPlugin({ strength: 0.6, axis: "y" }),
]);

export default function ParallaxDemo() {
  const srcs = [
    "https://picsum.photos/seed/parallax-1/800/600",
    "https://picsum.photos/seed/parallax-2/800/600",
    "https://picsum.photos/seed/parallax-3/800/600",
  ];
  return (
    <DemoPage
      title="Parallax 插件示例"
      description="向下慢慢滚动，观察图片相对背景产生明显位移。"
    >
      {/* 引导滚动的高视窗容器 */}
      <div
        style={{
          height: 800,
          overflow: "auto",
          border: "1px solid #ddd",
          borderRadius: 8,
          position: "relative",
        }}
      >
        {/* 背景网格，增强位移感知 */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(#eee 1px, transparent 1px), linear-gradient(90deg, #eee 1px, transparent 1px)",
            backgroundSize: "40px 40px, 40px 40px",
            zIndex: 0,
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 12,
            padding: 12,
            position: "relative",
            zIndex: 1,
          }}
        >
          {srcs.map((src, i) => (
            <div
              key={src + i}
              style={{ width: 320, height: 200, position: "relative" }}
            >
              <LazyImage
                src={src}
                alt={`Parallax ${i + 1}`}
                loading="lazy"
                rootMargin="300px"
                containerStyle={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                }}
                imageStyle={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </DemoPage>
  );
}
