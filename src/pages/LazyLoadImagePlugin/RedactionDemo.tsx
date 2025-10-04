import {
  LazyLoadImageCore,
  createRedactionPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createRedactionPlugin({
    boxes: [
      { x: 0.35, y: 0.18, w: 0.3, h: 0.2, blur: 8 },
      { x: 0.05, y: 0.72, w: 0.25, h: 0.2, color: "rgba(0,0,0,0.5)" },
    ],
  }),
]);

export default function RedactionDemo() {
  return (
    <DemoPage
      title="Redaction 插件示例"
      description="对图片的局部进行遮盖或模糊处理以保护隐私。"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {["rd-1", "rd-2", "rd-3"].map((seed) => (
          <div
            key={seed}
            style={{ width: 360, height: 240, position: "relative" }}
          >
            <LazyImage
              src={`https://picsum.photos/seed/${seed}/800/600`}
              loading="lazy"
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
