import {
  LazyLoadImageCore,
  withPlugins,
} from "vane-lazy-image";
import React, { useMemo, useState } from "react";
import {
  SandboxConfig,
  wrapPluginHook,
} from "vane-lazy-image/advanced";

import DemoPage from "./_layout/DemoPage";

const PluginSandboxDemo: React.FC = () => {
  const [scenario, setScenario] = useState<"none" | "unsafe" | "safe">("none");
  const [logs, setLogs] = useState<string[]>([]);
  const [imageKey, setImageKey] = useState(0);

  const addLog = (message: string, type: "info" | "success" | "error" = "info") => {
    const emoji = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";
    setLogs((prev) => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${emoji} ${message}`]);
  };

  // 创建不安全插件 - 会抛出错误
  const unsafePlugin = useMemo(() => ({
    name: "UnsafePlugin",
    version: "1.0.0",
    hooks: {
      onLoadSuccess: (_context: any, displaySrc?: string) => {
        addLog("不安全插件: onLoadSuccess 被调用", "error");
        throw new Error("❌ 模拟插件错误：这是一个故意的错误！");
      },
    },
  }), []);

  // 创建安全插件 - 使用沙箱包装
  const safePlugin = useMemo(() => {
    const sandboxConfig: SandboxConfig = {
      pluginName: "SafePlugin",
      enabled: true,
      hookTimeout: 2000,
      autoCleanup: true,
      debug: true,
    };

    return {
      name: "SafePlugin",
      version: "1.0.0",
      hooks: {
        onLoadSuccess: wrapPluginHook(
          (_context: any, displaySrc?: string) => {
            addLog("安全插件: onLoadSuccess 被调用", "success");
            throw new Error("这个错误会被沙箱捕获");
          },
          sandboxConfig
        ),
      },
    };
  }, []);

  // 动态创建图片组件
  const ImageComponent = useMemo(() => {
    if (scenario === "none") {
      return withPlugins(LazyLoadImageCore, []);
    } else if (scenario === "unsafe") {
      return withPlugins(LazyLoadImageCore, [unsafePlugin]);
    } else {
      return withPlugins(LazyLoadImageCore, [safePlugin]);
    }
  }, [scenario, unsafePlugin, safePlugin]);

  const handleShowUnsafe = () => {
    setScenario("unsafe");
    setImageKey((prev) => prev + 1);
    addLog("加载不安全插件（会抛出错误）", "info");
  };

  const handleShowSafe = () => {
    setScenario("safe");
    setImageKey((prev) => prev + 1);
    addLog("加载沙箱保护的插件（安全）", "info");
  };

  const handleReset = () => {
    setScenario("none");
    setImageKey((prev) => prev + 1);
    setLogs([]);
    addLog("重置演示", "info");
  };

  return (
    <DemoPage
      title="PluginSandbox - 插件沙箱机制"
      description="隔离插件执行环境，防止错误插件影响整个应用"
    >
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            padding: 16,
            background: "#fef2f2",
            borderRadius: "8px",
            border: "1px solid #ef4444",
          }}
        >
          <p style={{ margin: 0, color: "#991b1b", lineHeight: "1.6", marginBottom: 8 }}>
            ⚠️ <strong>沙箱机制保护：</strong>
          </p>
          <ul style={{ margin: 0, color: "#991b1b", lineHeight: "1.8" }}>
            <li>🛡️ 捕获插件内的错误和异常</li>
            <li>⏱️ 超时控制（防止死循环）</li>
            <li>🧹 自动清理资源和监听器</li>
            <li>📦 命名空间隔离（sharedData）</li>
          </ul>
        </div>
      </div>

      {/* 控制按钮 */}
      <div style={{ marginBottom: 30 }}>
        <h3 style={{ fontSize: "1.1em", marginBottom: 12 }}>🎮 测试场景</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={handleShowUnsafe}
            disabled={scenario === "unsafe"}
            style={{
              padding: "10px 20px",
              background: scenario === "unsafe" ? "#9ca3af" : "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: scenario === "unsafe" ? "not-allowed" : "pointer",
              fontSize: "0.95em",
            }}
          >
            ❌ 场景1: 不安全插件（会出错）
          </button>
          <button
            onClick={handleShowSafe}
            disabled={scenario === "safe"}
            style={{
              padding: "10px 20px",
              background: scenario === "safe" ? "#9ca3af" : "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: scenario === "safe" ? "not-allowed" : "pointer",
              fontSize: "0.95em",
            }}
          >
            ✅ 场景2: 沙箱保护（安全）
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: "10px 20px",
              background: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.95em",
            }}
          >
            🔄 重置
          </button>
        </div>
      </div>

      {/* 当前场景说明 */}
      {scenario !== "none" && (
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              padding: 16,
              background: scenario === "unsafe" ? "#fee2e2" : "#dcfce7",
              borderRadius: "8px",
              border: `1px solid ${scenario === "unsafe" ? "#dc2626" : "#16a34a"}`,
            }}
          >
            <strong style={{ color: scenario === "unsafe" ? "#991b1b" : "#166534" }}>
              {scenario === "unsafe" ? "❌ 不安全插件场景" : "✅ 沙箱保护场景"}
            </strong>
            <p style={{ margin: "8px 0 0", color: scenario === "unsafe" ? "#991b1b" : "#166534" }}>
              {scenario === "unsafe"
                ? "此插件在 onLoadSuccess 中抛出错误，会导致应用崩溃。观察控制台的错误信息。"
                : "相同的错误逻辑，但被沙箱包装。错误被捕获，应用继续正常运行。"}
            </p>
          </div>
        </div>
      )}

      {/* 图片展示 */}
      <div style={{ marginBottom: 30 }}>
        <h3 style={{ fontSize: "1.1em", marginBottom: 12 }}>🖼️ 测试图片</h3>
        <p style={{ color: "#666", marginBottom: 12 }}>
          {scenario === "none"
            ? "点击上方按钮选择测试场景"
            : "观察图片加载时的插件行为和错误处理"}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {Array.from({ length: 3 }, (_, i) => (
            <div key={`${imageKey}-${scenario}-${i}`}>
              <div style={{ width: "100%", height: 200 }}>
                <ImageComponent
                  src={`https://picsum.photos/seed/sandbox-${scenario}-${i}/800/600`}
                  alt={`沙箱测试 ${i + 1}`}
                  loading="lazy"
                  containerStyle={{
                    width: "100%",
                    height: "100%",
                    background: "#f3f4f6",
                    borderRadius: "8px",
                  }}
                  imageStyle={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <p
                style={{
                  textAlign: "center",
                  marginTop: 8,
                  fontSize: "0.85em",
                  color: "#666",
                }}
              >
                图片 {i + 1}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 操作日志 */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: "1.1em", marginBottom: 12 }}>📜 操作日志</h3>
        <div
          style={{
            padding: 16,
            background: "#1f2937",
            borderRadius: "8px",
            color: "#d1d5db",
            fontFamily: "monospace",
            fontSize: "0.85em",
            maxHeight: 200,
            overflow: "auto",
          }}
        >
          {logs.length === 0 ? (
            <div style={{ color: "#6b7280" }}>等待操作...</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} style={{ marginBottom: 4 }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 配置示例 */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: "1.1em", marginBottom: 12 }}>📋 沙箱配置选项</h3>
        <div
          style={{
            padding: 16,
            background: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <pre style={{ margin: 0, fontSize: "0.85em", overflow: "auto" }}>
{`import { wrapPluginHook, SandboxConfig } from "vane-lazy-image/advanced";

const sandboxConfig: SandboxConfig = {
  pluginName: "MyPlugin",     // 插件名称（命名空间）
  enabled: true,              // 是否启用沙箱
  hookTimeout: 5000,          // 钩子超时时间（ms）
  autoCleanup: true,          // 自动清理监听器
  debug: true,                // 调试模式
};

// 包装不安全的钩子函数
const safeHook = wrapPluginHook(unsafeHook, sandboxConfig);

// 使用沙箱保护的插件
const safePlugin = {
  name: "SafePlugin",
  onLoadSuccess: safeHook,
};`}
          </pre>
        </div>
      </div>

      {/* 使用建议 */}
      <div>
        <div
          style={{
            padding: 16,
            background: "#eff6ff",
            borderRadius: "8px",
            border: "1px solid #3b82f6",
          }}
        >
          <p style={{ margin: 0, color: "#1e40af", lineHeight: "1.6", marginBottom: 8 }}>
            💡 <strong>使用建议：</strong>
          </p>
          <ul style={{ margin: 0, color: "#1e40af", lineHeight: "1.8" }}>
            <li>对第三方插件使用沙箱包装</li>
            <li>在开发环境启用 debug 模式</li>
            <li>根据插件复杂度调整超时时间</li>
            <li>使用命名空间避免数据冲突</li>
            <li>查看浏览器控制台获取详细日志</li>
          </ul>
        </div>
      </div>
    </DemoPage>
  );
};

export default PluginSandboxDemo;
