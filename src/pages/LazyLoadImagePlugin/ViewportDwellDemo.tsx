import {
  LazyLoadImageCore,
  createViewportDwellPlugin,
  withPlugins,
} from "../../components/LazyLoadImagePlugin";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const ImageWithDwell = withPlugins(LazyLoadImageCore, [
  createViewportDwellPlugin({
    dwellMs: 1000, // 需要在视口停留1秒才加载
    maxWaitMs: 3000, // 最长等待3秒
    onlyWhenIntersecting: true,
    debug: true,
  }),
]);

const ViewportDwellDemo: React.FC = () => {
  const srcs = Array.from(
    { length: 12 },
    (_, i) =>
      `https://picsum.photos/seed/viewport-dwell-${i}/800/600?w=1280&auto=format&fit=crop`
  );

  return (
    <DemoPage
      title="ViewportDwell - 视口驻留加载"
      description="图片进入视口后需停留一定时间才开始加载，减少快速滚动时的无效请求"
    >
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            padding: 16,
            background: "#fef3c7",
            borderRadius: "8px",
            border: "1px solid #f59e0b",
          }}
        >
          <p style={{ margin: 0, color: "#92400e", lineHeight: "1.6" }}>
            ⏱️ <strong>驻留时间策略：</strong>
            图片进入视口后需停留 <strong>1 秒</strong>{" "}
            才会开始加载。快速滚动时不会触发加载，节省带宽。
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {srcs.map((src, i) => (
          <div key={src + i} style={{ width: "100%", height: 200 }}>
            <ImageWithDwell
              src={src}
              alt={`视口驻留加载示例 ${i + 1}`}
              loading="lazy"
              rootMargin="200px"
              containerStyle={{
                width: "100%",
                height: "100%",
                background: "#f3f4f6",
              }}
              imageStyle={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <p
              style={{
                textAlign: "center",
                marginTop: 8,
                fontSize: "0.9em",
                color: "#666",
              }}
            >
              图片 {i + 1}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <div
          style={{
            padding: 16,
            background: "#dbeafe",
            borderRadius: "8px",
            border: "1px solid #3b82f6",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#1e40af",
              lineHeight: "1.6",
              marginBottom: 8,
            }}
          >
            💡 <strong>测试方法：</strong>
          </p>
          <ul style={{ margin: 0, color: "#1e40af", lineHeight: "1.8" }}>
            <li>快速滚动页面，图片不会立即加载</li>
            <li>在某张图片上停留1秒以上，它会开始加载</li>
            <li>打开控制台查看驻留时间日志</li>
          </ul>
        </div>
      </div>
    </DemoPage>
  );
};

export default ViewportDwellDemo;

