import React from "react";
import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface OfflinePluginConfig {
  enabled?: boolean;
}

export function createOfflinePlugin(config: OfflinePluginConfig = {}): LazyImagePlugin {
  const { enabled = true } = config;
  return {
    name: "offline",
    version: "0.1.0",
    config,
    hooks: {
      onMount: (context: PluginContext) => {
        if (!enabled) return;
        // 可扩展：注册 Service Worker、离线策略等
      },
      renderOverlay: (context: PluginContext) => {
        if (!enabled) return null;
        const isSaveData = !!context.networkInfo?.saveData;
        return (
          <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.6)", color: "#fff", padding: "4px 6px", borderRadius: 4, fontSize: 12 }}>
            OfflinePlugin · saveData: {String(isSaveData)}
          </div>
        );
      },
    },
  };
}