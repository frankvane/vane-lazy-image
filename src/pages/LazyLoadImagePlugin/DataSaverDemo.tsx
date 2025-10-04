import {
  LazyLoadImageCore,
  createDataSaverPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createDataSaverPlugin({
    respectSaveData: true,
    fallbackQuality: 0.5,
    disablePreload: true,
    qualityParam: "q",
  }),
]);

export default function DataSaverDemo() {
  const srcs = [
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=1280&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526914706405-6cc2ff1d4c9e?w=1280&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1478810811738-1b1c1f8cbc51?w=1280&auto=format&fit=crop",
  ];

  return (
    <DemoPage
      title="DataSaver 插件示例"
      description="当浏览器开启数据节省（Save-Data）时，插件自动在 URL 追加质量参数并将图片设为懒加载。"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 12,
        }}
      >
        {srcs.map((src, i) => (
          <div key={src + i} style={{ width: 320, height: 200 }}>
            <LazyImage
              src={src}
              alt={`DataSaver ${i + 1}`}
              loading="lazy"
              rootMargin="300px"
              containerStyle={{ width: "100%", height: "100%" }}
              imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </DemoPage>
  );
}
