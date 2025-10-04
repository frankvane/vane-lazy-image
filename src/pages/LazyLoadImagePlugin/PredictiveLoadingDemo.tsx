import {
  LazyLoadImageCore,
  PluginContext,
  createPredictiveLoadingPlugin,
  withPlugins,
} from "vane-lazy-image";
import React, { useMemo } from "react";

import DemoPage from "./_layout/DemoPage";

const IMAGES = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=640&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=640&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=640&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=640&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=640&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=640&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=640&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=640&auto=format&fit=crop",
];

function heuristicPredict(context: PluginContext): string[] {
  const currentIndex = IMAGES.findIndex((u) => u === context.src);
  if (currentIndex < 0) return IMAGES.slice(0, 3);
  const next = IMAGES.slice(currentIndex + 1, currentIndex + 4);
  if (next.length < 3) {
    next.push(...IMAGES.slice(0, 3 - next.length));
  }
  return next;
}

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createPredictiveLoadingPlugin({
    model: "heuristic",
    predict: heuristicPredict,
    maxPreload: 3,
    as: "image",
    crossOrigin: "anonymous",
  }),
]);

export default function PredictiveLoadingDemo() {
  const list = useMemo(() => IMAGES, []);

  return (
    <DemoPage
      title="PredictiveLoading 插件示例"
      description="基于启发式预测，提前为后续图片添加 preload 链接，加快后续加载。"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 12,
        }}
      >
        {list.map((src, idx) => (
          <div
            key={src + idx}
            style={{ width: 320, height: 200, position: "relative" }}
          >
            <LazyImage
              src={src}
              alt={`Predictive image ${idx + 1}`}
              loading="lazy"
              rootMargin="300px"
              containerStyle={{ width: "100%", height: "100%" }}
              imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
              containerClassName="lazy-image-container"
            />
          </div>
        ))}
      </div>
    </DemoPage>
  );
}
