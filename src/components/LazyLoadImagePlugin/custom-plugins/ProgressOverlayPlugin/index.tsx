import React, { useEffect, useState } from "react";
import type { LazyImagePlugin, PluginContext, ProgressInfo } from "../../plugins/types";

export interface ProgressOverlayConfig {
  showWhen?: "always" | "loading";
  height?: number; // 进度条高度
  color?: string; // 进度条颜色
  background?: string; // 背景遮罩色
  showPercentText?: boolean; // 是否显示百分比文本
}

function ProgressOverlayView({ bus, loading, showWhen = "loading", height = 3, color = "#3b82f6", background = "rgba(0,0,0,0.15)", showPercentText = true }: {
  bus: PluginContext["bus"];
  loading: boolean;
  showWhen?: ProgressOverlayConfig["showWhen"];
  height?: number;
  color?: string;
  background?: string;
  showPercentText?: boolean;
}) {
  const [progress, setProgress] = useState<ProgressInfo | null>(null);
  const [displayPercent, setDisplayPercent] = useState(0);
  const timerRef = React.useRef<number | null>(null);

  useEffect(() => {
    const offProgress = bus?.on("progress", (p: ProgressInfo) => {
      setProgress(p);
      if (p.indeterminate) {
        // 不确定进度：使用本地节拍将显示百分比缓慢推进到 90%
        if (!timerRef.current) {
          timerRef.current = window.setInterval(() => {
            setDisplayPercent((prev) => (prev < 90 ? prev + 3 : prev));
          }, 160);
        }
      } else {
        // 确定进度：直接使用真实百分比
        setDisplayPercent(p.percent ?? 0);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    });
    return () => {
      offProgress && offProgress();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [bus]);

  const visible = showWhen === "always" ? true : loading;
  const percent = progress?.indeterminate ? displayPercent : (progress?.percent ?? 0);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background,
        display: "flex",
        alignItems: "flex-end",
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: `${percent}%`,
          height,
          background: color,
          transition: "width 200ms ease",
        }}
      />
      {showPercentText && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 12,
            color: "#fff",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          {progress?.indeterminate ? `加载中… ${percent}%` : `${percent}%`}
        </div>
      )}
    </div>
  );
}

export function createProgressOverlayPlugin(
  config: ProgressOverlayConfig = {}
): LazyImagePlugin {
  return {
    name: "progress-overlay",
    version: "1.0.0",
    config,
    hooks: {
      renderOverlay: ({ bus, imageState }) => {
        return (
          <ProgressOverlayView
            bus={bus}
            loading={imageState.isLoading}
            showWhen={config.showWhen}
            height={config.height}
            color={config.color}
            background={config.background}
            showPercentText={config.showPercentText ?? true}
          />
        );
      },
      onProgress: () => {
        // 已由视图订阅总线进度，这里无需额外处理
      },
    },
  };
}