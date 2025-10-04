import {
  LazyLoadImageCore,
  createFetchLoaderPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createFetchLoaderPlugin({ enabled: true }),
]);

export default function FetchLoaderDemo() {
  return (
    <DemoPage
      title="FetchLoader 插件示例"
      description="使用单次请求加载器，演示基础加载过程。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/fetch-loader-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
