import {
  LazyLoadImageCore,
  createFallbackImagePlugin,
  createWebPPlugin,
  withPlugins,
} from "../../components/LazyLoadImagePlugin";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const WebPImage = withPlugins(LazyLoadImageCore, [
  createWebPPlugin({
    enabled: true,
    testSupport: true,
    replaceExtensions: [".jpg", ".jpeg", ".png"],
    appendQueryParam: "format=webp",
  }),
  createFallbackImagePlugin({
    fallbackSrc: "/404.jpg",
  }),
]);

const WebPDemo: React.FC = () => {
  const srcs = [
    "https://picsum.photos/seed/webp-1/800/600",
    "https://picsum.photos/seed/webp-2/800/600",
    "https://picsum.photos/seed/webp-3/800/600",
    "https://picsum.photos/seed/webp-4/800/600",
  ];

  return (
    <DemoPage
      title="WebP - WebP 格式优化"
      description="自动检测浏览器支持并优先使用 WebP 格式，显著减小图片体积"
    >
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            padding: 16,
            background: "#f0fdf4",
            borderRadius: "8px",
            border: "1px solid #22c55e",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#166534",
              lineHeight: "1.6",
              marginBottom: 8,
            }}
          >
            🎯 <strong>WebP 优势：</strong>
          </p>
          <ul style={{ margin: 0, color: "#166534", lineHeight: "1.8" }}>
            <li>体积比 JPEG 小 25-35%</li>
            <li>比 PNG 小 26%</li>
            <li>支持透明度和动画</li>
            <li>自动检测浏览器支持并回退</li>
          </ul>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {srcs.map((src, i) => (
          <div key={src + i}>
            <div style={{ width: "100%", height: 220 }}>
              <WebPImage
                src={src}
                alt={`WebP 优化示例 ${i + 1}`}
                loading="lazy"
                rootMargin="300px"
                containerStyle={{
                  width: "100%",
                  height: "100%",
                  background: "#f3f4f6",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
                imageStyle={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <p
              style={{
                textAlign: "center",
                marginTop: 8,
                fontSize: "0.9em",
                color: "#666",
              }}
            >
              WebP 优化图片 {i + 1}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: 16,
          background: "#ede9fe",
          borderRadius: "8px",
          border: "1px solid #8b5cf6",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#5b21b6",
            lineHeight: "1.6",
            marginBottom: 8,
          }}
        >
          📊 <strong>格式对比：</strong>
        </p>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 12,
            background: "white",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th
                style={{
                  padding: "8px 12px",
                  textAlign: "left",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                格式
              </th>
              <th
                style={{
                  padding: "8px 12px",
                  textAlign: "left",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                大小
              </th>
              <th
                style={{
                  padding: "8px 12px",
                  textAlign: "left",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                质量
              </th>
              <th
                style={{
                  padding: "8px 12px",
                  textAlign: "left",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                支持度
              </th>
            </tr>
          </thead>
          <tbody style={{ color: "#5b21b6" }}>
            <tr>
              <td style={{ padding: "8px 12px", borderBottom: "1px solid #e5e7eb" }}>
                WebP
              </td>
              <td style={{ padding: "8px 12px", borderBottom: "1px solid #e5e7eb" }}>
                ⭐⭐⭐⭐⭐
              </td>
              <td style={{ padding: "8px 12px", borderBottom: "1px solid #e5e7eb" }}>
                ⭐⭐⭐⭐⭐
              </td>
              <td style={{ padding: "8px 12px", borderBottom: "1px solid #e5e7eb" }}>
                97%+
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px 12px", borderBottom: "1px solid #e5e7eb" }}>
                JPEG
              </td>
              <td style={{ padding: "8px 12px", borderBottom: "1px solid #e5e7eb" }}>
                ⭐⭐⭐
              </td>
              <td style={{ padding: "8px 12px", borderBottom: "1px solid #e5e7eb" }}>
                ⭐⭐⭐⭐
              </td>
              <td style={{ padding: "8px 12px", borderBottom: "1px solid #e5e7eb" }}>
                100%
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px 12px" }}>PNG</td>
              <td style={{ padding: "8px 12px" }}>⭐⭐</td>
              <td style={{ padding: "8px 12px" }}>⭐⭐⭐⭐⭐</td>
              <td style={{ padding: "8px 12px" }}>100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DemoPage>
  );
};

export default WebPDemo;

