import {
  LazyLoadImageCore,
  createAntiHotlinkPlugin,
  withPlugins,
} from "vane-lazy-image";

import React from "react";

const ImageWithAntiHotlink = withPlugins(LazyLoadImageCore, [
  createAntiHotlinkPlugin({
    allowedDomains: ["picsum.photos"],
    checkReferer: true,
    tokenParam: "token",
    generateToken: (src) => {
      try {
        // 简易签名示例：基于 src 生成稳定短 token（演示用途）
        const digest = btoa(unescape(encodeURIComponent(src))).replace(
          /=+$/,
          ""
        );
        return digest.slice(-8);
      } catch {
        return "demo-token";
      }
    },
  }),
]);

const AntiHotlinkDemo: React.FC = () => {
  const srcs = [
    "https://picsum.photos/seed/anti-hot-link-1/800/600?w=1280&auto=format&fit=crop",
    "https://picsum.photos/seed/anti-hot-link-2/800/600?w=1280&auto=format&fit=crop",
    "https://picsum.photos/seed/anti-hot-link-3/800/600?w=1280&auto=format&fit=crop",
  ];

  return (
    <div style={{ padding: 24 }}>
      <h3>AntiHotlink 插件示例</h3>
      <p style={{ color: "#666" }}>
        仅在白名单域名时注入签名参数，未带来源时添加 ref 标记。
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 12,
        }}
      >
        {srcs.map((src, i) => (
          <div key={src + i} style={{ width: 320, height: 200 }}>
            <ImageWithAntiHotlink
              src={src}
              alt={`AntiHotlink ${i + 1}`}
              loading="lazy"
              rootMargin="300px"
              containerStyle={{ width: "100%", height: "100%" }}
              imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AntiHotlinkDemo;
