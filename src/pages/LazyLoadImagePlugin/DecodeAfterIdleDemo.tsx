import {
  LazyLoadImageCore,
  createDecodeAfterIdlePlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createDecodeAfterIdlePlugin({ timeoutMs: 800 }),
]);

export default function DecodeAfterIdleDemo() {
  return (
    <DemoPage
      title="DecodeAfterIdle 插件示例"
      description="在浏览器空闲时执行 img.decode()，减少主线程卡顿。"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {["idle-1", "idle-2", "idle-3"].map((seed) => (
          <div key={seed} style={{ width: 360, height: 240 }}>
            <LazyImage
              src={`https://picsum.photos/seed/${seed}/800/600`}
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
