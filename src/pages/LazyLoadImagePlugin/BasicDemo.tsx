import DemoPage from "./_layout/DemoPage";
import { LazyLoadImageCore } from "../../components/LazyLoadImagePlugin";
import React from "react";

export default function BasicDemo() {
  return (
    <DemoPage
      title="基础示例"
      description="展示基础的图片懒加载功能。不需要配置任何插件，只进行核心的图片懒加载。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyLoadImageCore
          src="https://picsum.photos/id/10/800/600"
          isLCP={true} // Issue #0: 标记为 LCP 图片，立即加载
          loading="eager" // Issue #0: 首屏图片使用 eager 加载
          fetchPriority="high" // Issue #0: 高优先级加载
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
          onEnterViewport={() => {
            console.log("onEnterViewport");
          }}
          onLeaveViewport={() => {
            console.log("onLeaveViewport");
          }}
          onLoadSuccess={(displaySrc) => {
            console.log("onLoadSuccess", displaySrc);
          }}
        />
      </div>
    </DemoPage>
  );
}
