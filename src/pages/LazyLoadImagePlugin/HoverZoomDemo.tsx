import {
  LazyLoadImageCore,
  createHoverZoomPlugin,
  withPlugins,
} from "../../components/LazyLoadImagePlugin";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const ImageWithHoverZoom = withPlugins(LazyLoadImageCore, [
  createHoverZoomPlugin({
    scale: 1.2,
    durationMs: 300,
  }),
]);

const HoverZoomDemo: React.FC = () => {
  const srcs = [
    "https://picsum.photos/seed/hover-zoom-1/800/600?w=1280&auto=format&fit=crop",
    "https://picsum.photos/seed/hover-zoom-2/800/600?w=1280&auto=format&fit=crop",
    "https://picsum.photos/seed/hover-zoom-3/800/600?w=1280&auto=format&fit=crop",
    "https://picsum.photos/seed/hover-zoom-4/800/600?w=1280&auto=format&fit=crop",
  ];

  return (
    <DemoPage
      title="HoverZoom - 悬停放大"
      description="鼠标悬停时图片平滑放大效果，适合商品展示和图片库"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        {srcs.map((src, i) => (
          <div
            key={src + i}
            style={{
              width: "100%",
              height: 200,
              overflow: "hidden",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            <ImageWithHoverZoom
              src={src}
              alt={`悬停放大示例 ${i + 1}`}
              loading="lazy"
              rootMargin="300px"
              containerStyle={{ width: "100%", height: "100%" }}
              imageStyle={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease-in-out",
              }}
            />
          </div>
        ))}
      </div>
    </DemoPage>
  );
};

export default HoverZoomDemo;

