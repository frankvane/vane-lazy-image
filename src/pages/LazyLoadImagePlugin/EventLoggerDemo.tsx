import {
  LazyLoadImageCore,
  createEventLoggerPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createEventLoggerPlugin({ enabled: true, prefix: "[LLI-Event]" }),
]);

export default function EventLoggerDemo() {
  return (
    <DemoPage
      title="EventLogger 插件示例"
      description="记录插件系统关键事件到控制台。"
    >
      <div style={{ width: 480, height: 300, maxWidth: "100%" }}>
        <LazyImage
          src="https://picsum.photos/seed/event-logger-demo/800/600"
          loading="lazy"
          containerStyle={{ width: "100%", height: "100%" }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </DemoPage>
  );
}
