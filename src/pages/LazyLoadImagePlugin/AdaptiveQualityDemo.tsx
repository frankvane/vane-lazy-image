import {
  LazyLoadImageCore,
  createAdaptiveQualityPlugin,
  withPlugins,
} from "vane-lazy-image";

import React from "react";

// 实时模式：监听网络变化，随时调整 q
const LazyImageRealtime = withPlugins(LazyLoadImageCore as any, [
  createAdaptiveQualityPlugin({
    lowQ: 45,
    highQ: 85,
    saveDataQuality: 35,
    mode: "realtime",
  }),
]);

// 一次模式：仅在初始时设置 q（后续网络变化不影响）
const LazyImageOnce = withPlugins(LazyLoadImageCore as any, [
  createAdaptiveQualityPlugin({
    lowQ: 45,
    highQ: 85,
    saveDataQuality: 35,
    mode: "once",
  }),
]);

export default function AdaptiveQualityDemo() {
  return (
    <div style={{ padding: 24 }}>
      <h3>AdaptiveQuality 插件示例</h3>
      <p>展示两种模式：实时监听（realtime）与一次设置（once）。</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: 16,
        }}
      >
        <div>
          <h4 style={{ margin: "8px 0" }}>实时模式（realtime）</h4>
          <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
            <LazyImageRealtime
              src="https://picsum.photos/seed/aq-demo-realtime/800/600"
              loading="lazy"
              containerStyle={{ width: "100%", height: "100%" }}
              imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <small>切换系统网络或省流模式，观察地址中的 q 参数随网络变化。</small>
        </div>
        <div>
          <h4 style={{ margin: "8px 0" }}>一次模式（once）</h4>
          <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
            <LazyImageOnce
              src="https://picsum.photos/seed/aq-demo-once/800/600"
              loading="lazy"
              containerStyle={{ width: "100%", height: "100%" }}
              imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <small>
            仅在初次渲染时确定 q；之后网络变化不再影响（可切换网络后对比）。
          </small>
        </div>
      </div>
    </div>
  );
}
