import {
  LazyLoadImageCore,
  createBatteryAwarePlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createBatteryAwarePlugin({ lowBatteryThreshold: 0.3, downgradeWidth: 480 }),
]);

export default function BatteryAwareDemo() {
  return (
    <DemoPage
      title="BatteryAware 插件示例"
      description="低电量或省流模式时降级图片清晰度并采用懒加载。"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {["ba-1", "ba-2", "ba-3"].map((seed) => (
          <div key={seed} style={{ width: 360, height: 240 }}>
            <LazyImage
              src={`https://picsum.photos/seed/${seed}/1200/800`}
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
