import React from "react";
import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

export interface ComparisonPluginConfig {
  enabled?: boolean;
}

export function createComparisonPlugin(config: ComparisonPluginConfig = {}): LazyImagePlugin {
  const { enabled = true } = config;
  return {
    name: "comparison",
    version: "0.1.0",
    config,
    hooks: {
      renderOverlay: (context: PluginContext) => {
        if (!enabled) return null;
        // 最小实现：显示一个简单的 overlay 标识
        return (
          <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", padding: "4px 6px", borderRadius: 4, fontSize: 12 }}>
            ComparisonPlugin
          </div>
        );
      },
    },
  };
}