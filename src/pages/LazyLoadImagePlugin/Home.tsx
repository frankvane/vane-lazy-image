import { NavLink } from "react-router-dom";
import React from "react";

export default function Home() {
  return (
    <div className="page">
      <div className="page-header">
        <h1
          className="page-title"
          style={{ fontSize: "2.5em", marginBottom: "16px" }}
        >
          🖼️ Vane LazyLoadImage
        </h1>
        <p
          className="page-desc"
          style={{ fontSize: "1.2em", lineHeight: "1.8" }}
        >
          一个功能强大、高度可扩展的 React 图片懒加载组件库
        </p>
      </div>

      <div className="page-card" style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.5em", marginBottom: "16px" }}>✨ 核心特性</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          <div
            style={{
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "1.1em" }}>
              🔌 插件化架构
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              基于事件总线的插件系统，支持灵活组合和自定义扩展
            </p>
          </div>

          <div
            style={{
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "1.1em" }}>
              🎨 丰富的效果
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              支持水印、模糊占位、渐变过渡、滤镜等多种视觉效果
            </p>
          </div>

          <div
            style={{
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "1.1em" }}>
              ⚡ 性能优化
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              支持优先级加载、预连接、并发控制、缓存策略等
            </p>
          </div>

          <div
            style={{
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "1.1em" }}>
              🛡️ 错误处理
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              支持重试、降级、CDN 回退、离线缓存等容错机制
            </p>
          </div>

          <div
            style={{
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "1.1em" }}>
              ♿ 可访问性
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              支持 ARIA 属性、Alt 文本、SEO 优化等无障碍功能
            </p>
          </div>

          <div
            style={{
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "1.1em" }}>
              📊 监控分析
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              支持性能监控、网络分析、用户行为追踪等
            </p>
          </div>
        </div>
      </div>

      <div className="page-card" style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.5em", marginBottom: "16px" }}>🚀 快速开始</h2>
        <div
          style={{
            background: "#282c34",
            padding: "20px",
            borderRadius: "8px",
            color: "#abb2bf",
            fontSize: "14px",
            lineHeight: "1.8",
            overflowX: "auto",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <div style={{ color: "#5c6370", marginBottom: "4px" }}>// 安装</div>
            <div>
              <span style={{ color: "#c678dd" }}>npm</span> install
              vane-lazy-image
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <div style={{ color: "#5c6370", marginBottom: "4px" }}>
              // 基础使用
            </div>
            <div>
              <span style={{ color: "#c678dd" }}>import</span> {"{"}{" "}
              LazyLoadImageCore, withPlugins {"}"}{" "}
              <span style={{ color: "#c678dd" }}>from</span>{" "}
              <span style={{ color: "#98c379" }}>"vane-lazy-image"</span>;
            </div>
          </div>

          <div>
            <div style={{ color: "#5c6370", marginBottom: "4px" }}>
              // 带插件使用
            </div>
            <div>
              <span style={{ color: "#c678dd" }}>const</span> LazyImage ={" "}
              <span style={{ color: "#61afef" }}>withPlugins</span>
              (LazyLoadImageCore, [plugins]);
            </div>
          </div>
        </div>
      </div>

      <div className="page-card" style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.5em", marginBottom: "16px" }}>📚 示例导航</h2>
        <div style={{ lineHeight: "2" }}>
          <p style={{ marginBottom: "12px" }}>
            <strong>组合示例：</strong>探索多个插件配合使用的效果
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            <NavLink
              to="/lli-plugin/combo/error-resilience"
              style={{
                padding: "6px 12px",
                background: "#e7f3ff",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.9em",
              }}
            >
              错误韧性组合
            </NavLink>
            <NavLink
              to="/lli-plugin/combo/performance"
              style={{
                padding: "6px 12px",
                background: "#e7f3ff",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.9em",
              }}
            >
              性能优化组合
            </NavLink>
            <NavLink
              to="/lli-plugin/combo/visual-effects"
              style={{
                padding: "6px 12px",
                background: "#e7f3ff",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.9em",
              }}
            >
              视觉效果组合
            </NavLink>
          </div>

          <p style={{ marginBottom: "12px" }}>
            <strong>单个插件：</strong>查看每个插件的具体功能和用法
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <NavLink
              to="/lli-plugin/watermark"
              style={{
                padding: "6px 12px",
                background: "#fff4e6",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.9em",
              }}
            >
              水印
            </NavLink>
            <NavLink
              to="/lli-plugin/blur-up"
              style={{
                padding: "6px 12px",
                background: "#fff4e6",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.9em",
              }}
            >
              模糊占位
            </NavLink>
            <NavLink
              to="/lli-plugin/fade-in"
              style={{
                padding: "6px 12px",
                background: "#fff4e6",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.9em",
              }}
            >
              渐入效果
            </NavLink>
            <NavLink
              to="/lli-plugin/retry-on-error"
              style={{
                padding: "6px 12px",
                background: "#fff4e6",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.9em",
              }}
            >
              错误重试
            </NavLink>
            <NavLink
              to="/lli-plugin/image-optimization"
              style={{
                padding: "6px 12px",
                background: "#fff4e6",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.9em",
              }}
            >
              图片优化
            </NavLink>
          </div>
        </div>
      </div>

      <div className="page-card">
        <h2 style={{ fontSize: "1.5em", marginBottom: "16px" }}>💡 提示</h2>
        <ul
          style={{
            lineHeight: "2",
            color: "#666",
            paddingLeft: "20px",
          }}
        >
          <li>点击左侧菜单栏探索所有可用的插件示例</li>
          <li>每个示例页面底部都会显示完整的源代码</li>
          <li>支持 60+ 种插件，可根据需求自由组合</li>
          <li>查看浏览器控制台可以看到更多日志信息</li>
        </ul>
      </div>
    </div>
  );
}
