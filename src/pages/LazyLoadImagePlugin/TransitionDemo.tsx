import {
  LazyLoadImageCore,
  createTransitionPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createTransitionPlugin({
    durationMs: 400,
    fromOpacity: 0,
    toOpacity: 1,
    fromScale: 0.98,
    toScale: 1,
  }),
]);

export default function TransitionDemo() {
  return (
    <DemoPage
      title="Transition 插件示例"
      description="图片加载完成时执行淡入与缩放过渡效果。"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 12,
        }}
      >
        {["t1", "t2", "t3"].map((k) => (
          <div key={k} style={{ width: 320, height: 200 }}>
            <LazyImage
              src={`https://picsum.photos/seed/transition-${k}/800/600`}
              loading="lazy"
              containerStyle={{ width: "100%", height: "100%" }}
              imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </DemoPage>
  );
}
