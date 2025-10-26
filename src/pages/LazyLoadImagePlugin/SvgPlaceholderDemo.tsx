import {
  LazyLoadImageCore,
  createSvgPlaceholderPlugin,
  withPlugins,
} from "../../components/LazyLoadImagePlugin";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const ImageWithSvgPlaceholder = withPlugins(LazyLoadImageCore, [
  createSvgPlaceholderPlugin({
    svgContent: '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/></svg>',
    showWhen: "loading",
    fadeOutOnLoaded: true,
  }),
]);

const ImageWithGradientPlaceholder = withPlugins(LazyLoadImageCore, [
  createSvgPlaceholderPlugin({
    svgContent: '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#667eea"/><stop offset="100%" stop-color="#764ba2"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#grad)"/></svg>',
    showWhen: "loading",
    fadeOutOnLoaded: true,
  }),
]);

const ImageWithPatternPlaceholder = withPlugins(LazyLoadImageCore, [
  createSvgPlaceholderPlugin({
    svgContent: '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="2" fill="#cbd5e0"/></pattern><rect width="100%" height="100%" fill="url(#dots)"/></svg>',
    showWhen: "loading",
    fadeOutOnLoaded: true,
  }),
]);

const SvgPlaceholderDemo: React.FC = () => {
  const srcs = [
    "https://picsum.photos/seed/svg-placeholder-1/800/600?w=1280&auto=format&fit=crop",
    "https://picsum.photos/seed/svg-placeholder-2/800/600?w=1280&auto=format&fit=crop",
    "https://picsum.photos/seed/svg-placeholder-3/800/600?w=1280&auto=format&fit=crop",
  ];

  return (
    <DemoPage
      title="SvgPlaceholder - SVG 占位符"
      description="使用 SVG 生成轻量级、可缩放的占位符效果"
    >
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: "1.1em", marginBottom: 8 }}>
          Shimmer 闪烁效果
        </h3>
        <p style={{ color: "#666", marginBottom: 12 }}>
          流光动画效果，模拟内容加载中的状态
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {srcs.map((src, i) => (
            <div key={`shimmer-${i}`} style={{ width: "100%", height: 180 }}>
              <ImageWithSvgPlaceholder
                src={src}
                alt={`Shimmer 占位符 ${i + 1}`}
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
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: "1.1em", marginBottom: 8 }}>渐变占位符</h3>
        <p style={{ color: "#666", marginBottom: 12 }}>
          使用渐变色作为占位符，提供优雅的视觉效果
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {srcs.map((src, i) => (
            <div key={`gradient-${i}`} style={{ width: "100%", height: 180 }}>
              <ImageWithGradientPlaceholder
                src={src}
                alt={`渐变占位符 ${i + 1}`}
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
      </div>

      <div>
        <h3 style={{ fontSize: "1.1em", marginBottom: 8 }}>图案占位符</h3>
        <p style={{ color: "#666", marginBottom: 12 }}>
          使用点阵或其他图案作为占位符
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {srcs.map((src, i) => (
            <div key={`pattern-${i}`} style={{ width: "100%", height: 180 }}>
              <ImageWithPatternPlaceholder
                src={src}
                alt={`图案占位符 ${i + 1}`}
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
      </div>
    </DemoPage>
  );
};

export default SvgPlaceholderDemo;

