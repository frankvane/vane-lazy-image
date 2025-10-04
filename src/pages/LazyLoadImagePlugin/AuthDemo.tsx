import {
  LazyLoadImageCore,
  createAuthPlugin,
  createErrorOverlayPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

// 有权限（追加鉴权参数）
const LazyImageWithAuth = withPlugins(LazyLoadImageCore as any, [
  createAuthPlugin({ token: () => "demo-token-123", tokenParam: "auth" }),
]);

// 无权限（不追加鉴权参数）
const LazyImageNoAuth = withPlugins(LazyLoadImageCore as any, []);

// 模拟无权限/受限资源（展示错误覆盖层）
const LazyImageProtected = withPlugins(LazyLoadImageCore as any, [
  createErrorOverlayPlugin({ retryText: "重试" }),
]);

export default function AuthDemo() {
  return (
    <DemoPage
      title="Auth 插件示例"
      description="演示有/无鉴权参数的差异，并附带一个受限资源的失败示例。"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 12,
        }}
      >
        <div>
          <h4 style={{ margin: "8px 0" }}>有授权参数</h4>
          <div style={{ width: 320, height: 200 }}>
            <LazyImageWithAuth
              src="https://picsum.photos/seed/auth-demo/800/600"
              loading="lazy"
              containerStyle={{ width: "100%", height: "100%" }}
              imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        <div>
          <h4 style={{ margin: "8px 0" }}>无授权参数</h4>
          <div style={{ width: 320, height: 200 }}>
            <LazyImageNoAuth
              src="https://picsum.photos/seed/no-auth-demo/800/600"
              loading="lazy"
              containerStyle={{ width: "100%", height: "100%" }}
              imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        <div>
          <h4 style={{ margin: "8px 0" }}>受限资源（模拟 403/404）</h4>
          <div style={{ width: 320, height: 200 }}>
            <LazyImageProtected
              src="https://invalid.example.com/secure.jpg"
              loading="lazy"
              containerStyle={{ width: "100%", height: "100%" }}
              imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </DemoPage>
  );
}
