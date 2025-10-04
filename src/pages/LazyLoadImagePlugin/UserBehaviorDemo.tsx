import {
  LazyLoadImageCore,
  createUserBehaviorPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createUserBehaviorPlugin({
    onReport: (data) => {
      // 示例：控制台输出用户行为数据
      console.log("[UserBehaviorDemo] report", data);
    },
  }),
]);

export default function UserBehaviorDemo() {
  const srcs = [
    "https://picsum.photos/seed/ub-1/800/600",
    "https://picsum.photos/seed/ub-2/800/600",
    "https://picsum.photos/seed/ub-3/800/600",
  ];
  return (
    <DemoPage
      title="UserBehavior 插件示例"
      description="点击图片或滚动进入/离开视口，观察右上角统计实时更新。"
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
              alt={`UserBehavior ${i + 1}`}
              loading="lazy"
              rootMargin="300px"
              containerStyle={{
                width: "100%",
                height: "100%",
                position: "relative",
              }}
              imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </DemoPage>
  );
}
