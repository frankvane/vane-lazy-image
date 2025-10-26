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
          style={{ fontSize: "1.2em", lineHeight: "1.8", marginBottom: "12px" }}
        >
          一个功能强大、高度可扩展的 React 图片懒加载组件库
        </p>
        <div
          style={{
            display: "inline-flex",
            gap: "8px",
            flexWrap: "wrap",
            fontSize: "0.9em",
          }}
        >
          <span
            style={{
              padding: "4px 12px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: "12px",
              fontWeight: "600",
            }}
          >
            v1.0.17
          </span>
          <span
            style={{
              padding: "4px 12px",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              borderRadius: "12px",
              fontWeight: "600",
            }}
          >
            🚀 99% 资源优化
          </span>
          <span
            style={{
              padding: "4px 12px",
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              borderRadius: "12px",
              fontWeight: "600",
            }}
          >
            60+ 插件
          </span>
        </div>
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
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "8px",
              border: "2px solid #667eea",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontSize: "1.1em", color: "white" }}>
              ⚡ 性能优化 🆕
            </h3>
            <p style={{ color: "rgba(255, 255, 255, 0.95)", lineHeight: "1.6" }}>
              GlobalContext + ObserverPool 双重优化，减少 99% 资源消耗
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

      <div
        className="page-card"
        style={{
          marginBottom: "20px",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          border: "2px solid #667eea",
        }}
      >
        <h2 style={{ fontSize: "1.5em", marginBottom: "16px" }}>
          🎯 v1.0.17 核心优化
        </h2>
        <div style={{ lineHeight: "2" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                padding: "16px",
                background: "white",
                borderRadius: "8px",
                border: "1px solid #e9ecef",
              }}
            >
              <h3 style={{ fontSize: "1em", marginBottom: "8px", color: "#667eea" }}>
                🌐 GlobalContext 全局单例
              </h3>
              <p style={{ fontSize: "0.9em", color: "#666", margin: 0 }}>
                网络/设备信息自动缓存，监听器数量减少 95%
              </p>
            </div>
            <div
              style={{
                padding: "16px",
                background: "white",
                borderRadius: "8px",
                border: "1px solid #e9ecef",
              }}
            >
              <h3 style={{ fontSize: "1em", marginBottom: "8px", color: "#667eea" }}>
                👁️ ObserverPool 共享池
              </h3>
              <p style={{ fontSize: "0.9em", color: "#666", margin: 0 }}>
                Observer 实例共享，内存占用减少 99%
              </p>
            </div>
            <div
              style={{
                padding: "16px",
                background: "white",
                borderRadius: "8px",
                border: "1px solid #e9ecef",
              }}
            >
              <h3 style={{ fontSize: "1em", marginBottom: "8px", color: "#667eea" }}>
                ⚡ 综合性能提升
              </h3>
              <p style={{ fontSize: "0.9em", color: "#666", margin: 0 }}>
                100 张图片从 200 次检测减少到 2 次
              </p>
            </div>
          </div>
          <div
            style={{
              padding: "12px",
              background: "#fff3cd",
              borderRadius: "6px",
              border: "1px solid #ffc107",
              fontSize: "0.9em",
              color: "#856404",
            }}
          >
            💡 <strong>提示：</strong>查看{" "}
            <NavLink
              to="/lli-plugin/performance-optimization"
              style={{ color: "#667eea", fontWeight: "600" }}
            >
              性能优化综合演示
            </NavLink>{" "}
            了解详细的优化效果
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
            <strong>🆕 性能优化演示：</strong>查看最新的性能优化效果
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
              to="/lli-plugin/global-context"
              style={{
                padding: "6px 12px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.9em",
                fontWeight: "600",
              }}
            >
              🚀 GlobalContext
            </NavLink>
            <NavLink
              to="/lli-plugin/observer-pool"
              style={{
                padding: "6px 12px",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.9em",
                fontWeight: "600",
              }}
            >
              👁️ ObserverPool
            </NavLink>
            <NavLink
              to="/lli-plugin/performance-optimization"
              style={{
                padding: "6px 12px",
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.9em",
                fontWeight: "600",
              }}
            >
              ⚡ 性能优化综合
            </NavLink>
          </div>

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
            <NavLink
              to="/lli-plugin/hover-zoom"
              style={{
                padding: "6px 12px",
                background: "#fff4e6",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.9em",
              }}
            >
              悬停放大
            </NavLink>
            <NavLink
              to="/lli-plugin/responsive"
              style={{
                padding: "6px 12px",
                background: "#fff4e6",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.9em",
              }}
            >
              响应式
            </NavLink>
            <NavLink
              to="/lli-plugin/seo"
              style={{
                padding: "6px 12px",
                background: "#fff4e6",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.9em",
              }}
            >
              SEO优化
            </NavLink>
            <NavLink
              to="/lli-plugin/svg-placeholder"
              style={{
                padding: "6px 12px",
                background: "#fff4e6",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.9em",
              }}
            >
              SVG占位符
            </NavLink>
            <NavLink
              to="/lli-plugin/viewport-dwell"
              style={{
                padding: "6px 12px",
                background: "#fff4e6",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.9em",
              }}
            >
              视口驻留
            </NavLink>
            <NavLink
              to="/lli-plugin/webp"
              style={{
                padding: "6px 12px",
                background: "#fff4e6",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.9em",
              }}
            >
              WebP优化
            </NavLink>
          </div>
        </div>
      </div>

      <div className="page-card">
        <h2 style={{ fontSize: "1.5em", marginBottom: "16px" }}>
          🚀 高级功能
        </h2>
        <p style={{ color: "#666", lineHeight: "1.8", marginBottom: "20px" }}>
          探索企业级高级特性：插件沙箱、性能监控、热更新和依赖管理系统
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <NavLink
            to="/lli-plugin/plugin-sandbox"
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "0.95em",
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
            }}
          >
            🛡️ 插件沙箱
          </NavLink>
          <NavLink
            to="/lli-plugin/performance-monitoring"
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "0.95em",
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(240, 147, 251, 0.4)",
            }}
          >
            📊 性能监控
          </NavLink>
          <NavLink
            to="/lli-plugin/plugin-hot-reload"
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "0.95em",
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(79, 172, 254, 0.4)",
            }}
          >
            🔥 热更新
          </NavLink>
          <NavLink
            to="/lli-plugin/dependency-resolver"
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "0.95em",
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(250, 112, 154, 0.4)",
            }}
          >
            🧩 依赖解析
          </NavLink>
        </div>
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            background: "#fef3c7",
            borderRadius: "8px",
            border: "1px solid #f59e0b",
          }}
        >
          <p style={{ margin: 0, color: "#92400e", lineHeight: "1.6" }}>
            <strong>💡 企业级特性：</strong>
          </p>
          <ul style={{ margin: "8px 0 0 20px", color: "#92400e", lineHeight: "1.8" }}>
            <li><strong>沙箱机制</strong>：隔离插件执行，防止错误传播</li>
            <li><strong>性能监控</strong>：完整的性能追踪和分析系统</li>
            <li><strong>热更新</strong>：运行时动态加载和替换插件</li>
            <li><strong>依赖解析</strong>：自动处理插件依赖关系</li>
          </ul>
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
