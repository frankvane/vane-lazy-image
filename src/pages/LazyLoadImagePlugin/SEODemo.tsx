import {
  LazyLoadImageCore,
  createSEOPlugin,
  withPlugins,
} from "../../components/LazyLoadImagePlugin";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const SEOImage = withPlugins(LazyLoadImageCore, [
  createSEOPlugin({
    altFallback: "SEO优化图片",
    aspectRatio: "16/9",
    priority: "lcp",
    preload: true,
  }),
]);

const SEODemo: React.FC = () => {
  const srcs = [
    {
      url: "https://picsum.photos/seed/seo-1/1200/630",
      title: "SEO优化示例图片 1",
      description: "这是一张经过SEO优化的图片，包含结构化数据和Open Graph标签",
    },
    {
      url: "https://picsum.photos/seed/seo-2/1200/630",
      title: "SEO优化示例图片 2",
      description: "适合社交媒体分享的图片，包含Twitter Card元数据",
    },
    {
      url: "https://picsum.photos/seed/seo-3/1200/630",
      title: "SEO优化示例图片 3",
      description: "搜索引擎友好的图片，增强页面SEO效果",
    },
  ];

  return (
    <DemoPage
      title="SEO - 搜索引擎优化"
      description="自动添加结构化数据、Open Graph 和 Twitter Card 元标签"
    >
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            padding: 16,
            background: "#f0f9ff",
            borderRadius: "8px",
            border: "1px solid #0ea5e9",
          }}
        >
          <p style={{ margin: 0, color: "#0369a1", lineHeight: "1.6" }}>
            🔍 <strong>SEO 优化功能：</strong>
          </p>
          <ul style={{ marginTop: 8, color: "#0369a1", lineHeight: "1.8" }}>
            <li>自动生成 Schema.org ImageObject 结构化数据</li>
            <li>添加 Open Graph 标签用于社交媒体分享</li>
            <li>添加 Twitter Card 元数据</li>
            <li>提升搜索引擎索引和排名</li>
          </ul>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: 20,
        }}
      >
        {srcs.map((item, i) => (
          <div
            key={item.url + i}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div style={{ width: "100%", height: 200 }}>
              <SEOImage
                src={item.url}
                alt={item.title}
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
            <div style={{ padding: 12 }}>
              <h4 style={{ margin: "0 0 8px", fontSize: "1em" }}>
                {item.title}
              </h4>
              <p style={{ margin: 0, fontSize: "0.9em", color: "#666" }}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DemoPage>
  );
};

export default SEODemo;

