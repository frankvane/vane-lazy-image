import {
  LazyLoadImageCore,
  createResponsivePlugin,
  withPlugins,
} from "../../components/LazyLoadImagePlugin";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const ResponsiveImage = withPlugins(LazyLoadImageCore, [
  createResponsivePlugin({
    variants: [
      { width: 640 },  // mobile
      { width: 1024 }, // tablet
      { width: 1920 }, // desktop
    ],
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px",
  }),
]);

const ResponsiveDemo: React.FC = () => {
  const srcs = [
    "https://picsum.photos/seed/responsive-1/1920/1080",
    "https://picsum.photos/seed/responsive-2/1920/1080",
    "https://picsum.photos/seed/responsive-3/1920/1080",
  ];

  return (
    <DemoPage
      title="Responsive - 响应式图片"
      description="根据设备屏幕大小自动选择最优图片尺寸和质量"
    >
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: "#666", lineHeight: "1.6" }}>
          💡 <strong>提示：</strong>调整浏览器窗口大小查看效果，插件会根据视口宽度自动选择最优图片源。
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {srcs.map((src, i) => (
          <div
            key={src + i}
            style={{
              width: "100%",
              height: 400,
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <ResponsiveImage
              src={src}
              alt={`响应式图片示例 ${i + 1}`}
              loading="lazy"
              rootMargin="300px"
              containerStyle={{ width: "100%", height: "100%" }}
              imageStyle={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>
    </DemoPage>
  );
};

export default ResponsiveDemo;

