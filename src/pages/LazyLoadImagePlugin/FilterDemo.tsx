import {
  FILTER_PRESETS,
  LazyLoadImageCore,
  createFilterPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImageGray = withPlugins(LazyLoadImageCore as any, [
  createFilterPlugin(FILTER_PRESETS.grayscaleSoft),
]);

const LazyImageSepia = withPlugins(LazyLoadImageCore as any, [
  createFilterPlugin(FILTER_PRESETS.sepiaWarm),
]);

const LazyImageBright = withPlugins(LazyLoadImageCore as any, [
  createFilterPlugin(FILTER_PRESETS.brightBoost),
]);

const LazyImageContrast = withPlugins(LazyLoadImageCore as any, [
  createFilterPlugin(FILTER_PRESETS.contrastPunch),
]);

const LazyImageSaturate = withPlugins(LazyLoadImageCore as any, [
  createFilterPlugin(FILTER_PRESETS.saturateVivid),
]);

export default function FilterDemo() {
  return (
    <DemoPage
      title="Filter 插件示例"
      description="展示不同滤镜参数与 hover 效果（灰度悬停还原）。"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
        }}
      >
        <div>
          <LazyImageGray
            src="https://picsum.photos/seed/filter-gray/800/600"
            loading="lazy"
            containerStyle={{ width: "100%", height: 160 }}
            imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="灰度 0.6，悬停还原"
          />
          <p style={{ marginTop: 6 }}>grayscale(0.6) + hover</p>
        </div>
        <div>
          <LazyImageSepia
            src="https://picsum.photos/seed/filter-sepia/800/600"
            loading="lazy"
            containerStyle={{ width: "100%", height: 160 }}
            imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="复古棕褐 0.5"
          />
          <p style={{ marginTop: 6 }}>sepia(0.5)</p>
        </div>
        <div>
          <LazyImageBright
            src="https://picsum.photos/seed/filter-bright/800/600"
            loading="lazy"
            containerStyle={{ width: "100%", height: 160 }}
            imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="亮度提升 1.2"
          />
          <p style={{ marginTop: 6 }}>brightness(1.2)</p>
        </div>
        <div>
          <LazyImageContrast
            src="https://picsum.photos/seed/filter-contrast/800/600"
            loading="lazy"
            containerStyle={{ width: "100%", height: 160 }}
            imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="对比度增强 1.3"
          />
          <p style={{ marginTop: 6 }}>contrast(1.3)</p>
        </div>
        <div>
          <LazyImageSaturate
            src="https://picsum.photos/seed/filter-saturate/800/600"
            loading="lazy"
            containerStyle={{ width: "100%", height: 160 }}
            imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="饱和度提升 1.4"
          />
          <p style={{ marginTop: 6 }}>saturate(1.4)</p>
        </div>
      </div>
    </DemoPage>
  );
}
