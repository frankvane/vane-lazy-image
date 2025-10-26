import {
  LazyLoadImageCore,
  createBadgePlugin,
  createSkeletonPlugin,
  withPlugins,
} from "vane-lazy-image";
import React, { useEffect, useMemo, useState } from "react";

import DemoPage from "./_layout/DemoPage";
import { createPluginManager } from "vane-lazy-image/plugins";

const PluginHotReloadDemo: React.FC = () => {
  const [pluginManager] = useState(() => createPluginManager());
  const [currentPlugins, setCurrentPlugins] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [imageKey, setImageKey] = useState(0);

  const addLog = (message: string, type: "info" | "success" | "error" = "info") => {
    const emoji = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";
    setLogs((prev) => [
      ...prev.slice(-14),
      `[${new Date().toLocaleTimeString()}] ${emoji} ${message}`,
    ]);
  };

  // 初始化插件 - 使用 Skeleton 插件（加载中显示骨架屏）
  useEffect(() => {
    // 注册初始插件：加载中的骨架屏
    const skeleton = createSkeletonPlugin({
      type: "pulse",
      showWhen: "loading"
    });
    pluginManager.register(skeleton);
    setCurrentPlugins([skeleton.name]);
    addLog(`注册插件: ${skeleton.name}`, "success");
  }, [pluginManager]);

  // 使用 useMemo 根据当前激活的插件动态创建组件
  // 注意：每次插件列表变化时都需要重新创建组件，因为 withPlugins 会捕获插件快照
  const ImageComponent = useMemo(() => {
    const activePlugins = pluginManager.getAllPlugins();
    console.log("[热更新] 重新创建组件，当前插件:", activePlugins.map((p: any) => p.name));
    return withPlugins(LazyLoadImageCore, activePlugins);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlugins, imageKey]); // pluginManager 引用稳定，不需要作为依赖

  const handleAddBadge = () => {
    const badge = createBadgePlugin({
      text: "🔥 HOT",
      position: "top-right",
      bgColor: "#ef4444",
      color: "#fff",
      fontSize: 14,
      padding: "4px 12px",
      showWhen: "loaded"
    });

    const success = pluginManager.register(badge);
    if (success) {
      setCurrentPlugins((prev) => [...prev, badge.name]);
      setImageKey((prev) => prev + 1); // 强制重新渲染
      addLog(`热注册插件: ${badge.name}`, "success");
    } else {
      addLog(`插件已存在: ${badge.name}`, "error");
    }
  };

  const handleRemoveBadge = () => {
    const success = pluginManager.unregister("badge");
    if (success) {
      setCurrentPlugins((prev) => prev.filter((name) => name !== "badge"));
      setImageKey((prev) => prev + 1); // 强制重新渲染
      addLog("卸载插件: badge", "success");
    } else {
      addLog("插件不存在: badge", "error");
    }
  };

  const handleReplacePlugin = () => {
    // 先卸载旧的骨架屏插件
    pluginManager.unregister("skeleton");

    // 注册新的 Badge 配置（不同样式）
    const newBadge = createBadgePlugin({
      text: "✨ NEW",
      position: "top-left",
      bgColor: "#10b981",
      color: "#fff",
      fontSize: 16,
      padding: "6px 16px",
      borderRadius: 8,
      showWhen: "always"
    });
    pluginManager.register(newBadge);
    setCurrentPlugins((prev) => [...prev.filter(n => n !== "skeleton"), newBadge.name]);

    setImageKey((prev) => prev + 1);
    addLog("热替换插件: skeleton → badge (绿色标签)", "success");
  };

  const handleResetPlugins = () => {
    // 卸载所有插件
    const allPlugins = pluginManager.getAllPlugins();
    allPlugins.forEach((plugin: any) => pluginManager.unregister(plugin.name));

    // 重新注册默认插件
    const skeleton = createSkeletonPlugin({
      type: "pulse",
      showWhen: "loading"
    });
    pluginManager.register(skeleton);
    setCurrentPlugins([skeleton.name]);
    setImageKey((prev) => prev + 1);
    addLog("重置所有插件", "info");
  };

  return (
    <DemoPage
      title="PluginHotReload - 插件热更新"
      description="运行时动态注册、卸载和替换插件，无需重启应用"
    >
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            padding: 16,
            background: "#fef3c7",
            borderRadius: "8px",
            border: "1px solid #f59e0b",
          }}
        >
          <p style={{ margin: 0, color: "#92400e", lineHeight: "1.6", marginBottom: 8 }}>
            🔥 <strong>热更新能力：</strong>
          </p>
          <ul style={{ margin: 0, color: "#92400e", lineHeight: "1.8" }}>
            <li>运行时注册新插件</li>
            <li>动态卸载已有插件</li>
            <li>热替换插件配置</li>
            <li>实时生效，无需重新加载</li>
          </ul>
        </div>
      </div>

      {/* 当前激活的插件 */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: "1.1em", marginBottom: 12 }}>🔌 当前激活的插件</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {currentPlugins.map((name) => (
            <div
              key={name}
              style={{
                padding: "6px 12px",
                background: "#dbeafe",
                borderRadius: "6px",
                fontSize: "0.9em",
                color: "#1e40af",
                border: "1px solid #3b82f6",
              }}
            >
              {name}
            </div>
          ))}
          {currentPlugins.length === 0 && (
            <div style={{ color: "#9ca3af", fontSize: "0.9em" }}>
              无激活插件
            </div>
          )}
        </div>
      </div>

      {/* 控制按钮 */}
      <div style={{ marginBottom: 30 }}>
        <h3 style={{ fontSize: "1.1em", marginBottom: 12 }}>🎮 热更新控制</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={handleAddBadge}
            style={{
              padding: "10px 16px",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.9em",
            }}
          >
            ➕ 添加红色角标
          </button>
          <button
            onClick={handleRemoveBadge}
            style={{
              padding: "10px 16px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.9em",
            }}
          >
            ➖ 移除角标插件
          </button>
          <button
            onClick={handleReplacePlugin}
            style={{
              padding: "10px 16px",
              background: "#f59e0b",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.9em",
            }}
          >
            🔄 替换为绿色角标
          </button>
          <button
            onClick={handleResetPlugins}
            style={{
              padding: "10px 16px",
              background: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.9em",
            }}
          >
            🔁 重置所有插件
          </button>
        </div>
      </div>

      {/* 图片展示 */}
      <div style={{ marginBottom: 30 }}>
        <h3 style={{ fontSize: "1.1em", marginBottom: 12 }}>🖼️ 实时效果</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {Array.from({ length: 4 }, (_, i) => (
            <div key={`${imageKey}-${i}`} style={{ width: "100%", height: 200 }}>
              <ImageComponent
                src={`https://picsum.photos/seed/hot-reload-${i}/800/600`}
                alt={`热更新示例 ${i + 1}`}
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
            maxHeight: 250,
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

      {/* API 使用示例 */}
      <div>
        <h3 style={{ fontSize: "1.1em", marginBottom: 12 }}>💻 API 使用示例</h3>
        <div
          style={{
            padding: 16,
            background: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <pre style={{ margin: 0, fontSize: "0.85em", overflow: "auto" }}>
{`import { createPluginManager, createBadgePlugin } from "vane-lazy-image";

// 创建插件管理器
const manager = createPluginManager();

// 注册插件（注意：插件名称通常是小写，如 "badge", "skeleton"）
const badge = createBadgePlugin({ text: "HOT" });
const success = manager.register(badge); // 返回 true/false

// 运行时添加新插件
const newBadge = createBadgePlugin({
  text: "NEW",
  bgColor: "#10b981"
});
manager.register(newBadge); // 热注册

// 卸载插件（使用正确的插件名称）
const removed = manager.unregister("badge"); // 返回 true/false

// 替换插件
manager.unregister("skeleton");
const replacement = createBadgePlugin({ text: "✨" });
manager.register(replacement); // 热替换

// 获取当前插件
const active = manager.getAllPlugins();`}
          </pre>
        </div>
      </div>
    </DemoPage>
  );
};

export default PluginHotReloadDemo;

