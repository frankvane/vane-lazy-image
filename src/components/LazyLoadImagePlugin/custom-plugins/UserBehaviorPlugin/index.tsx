import type { LazyImagePlugin, PluginContext } from "../../plugins/types";

import React from "react";

export interface UserBehaviorConfig {
  enabled?: boolean;
  onReport?: (data: {
    src: string;
    dwellMs: number;
    clicks: number;
    enters: number;
    leaves: number;
  }) => void;
}

export function createUserBehaviorPlugin(config: UserBehaviorConfig = {}): LazyImagePlugin {
  const { enabled = true, onReport } = config;
  return {
    name: "user-behavior",
    version: "1.0.0",
    config,
    hooks: {
      // 保持 IO 持续观察，便于统计进入/离开与驻留
      transformProps: (props) => ({ ...props, unobserveOnVisible: false }),
      onMount: (context: PluginContext) => {
        if (!enabled) return;
        // 初始数据写入 sharedData，便于 overlay 先显示占位
        try {
          context.sharedData?.set("ub:clicks", 0);
          context.sharedData?.set("ub:dwell", 0);
          context.sharedData?.set("ub:enters", 0);
          context.sharedData?.set("ub:leaves", 0);
          context.sharedData?.set("ub:enterTs", 0);
        } catch {}
      },
      onLoadSuccess: (context: PluginContext) => {
        if (!enabled) return;
        const img = context.imageRef?.current as any;
        if (!img) return;
        // 在图片真实挂载后再绑定事件，确保 ref 可用
        img.__lliUBClicks = img.__lliUBClicks || 0;
        img.__lliUBEnterTs = img.__lliUBEnterTs || 0;
        img.__lliUBDwell = img.__lliUBDwell || 0;
        img.__lliUBEnters = img.__lliUBEnters || 0;
        img.__lliUBLeaves = img.__lliUBLeaves || 0;
        const onClick = () => {
          img.__lliUBClicks += 1;
          // 同步点击次数到 sharedData，避免卸载时 img 为 null 导致统计丢失
          try {
            const clicks = (context.sharedData?.get("ub:clicks") || 0) + 1;
            context.sharedData?.set("ub:clicks", clicks);
          } catch {}
        };
        img.__lliUBClickHandler = onClick;
        try { img.addEventListener("click", onClick); } catch {}
      },
      onEnterViewport: (context: PluginContext) => {
        if (!enabled) return;
        const img = context.imageRef?.current as any;
        if (img) {
          img.__lliUBEnterTs = Date.now();
          img.__lliUBEnters = (img.__lliUBEnters || 0) + 1;
        }
        try {
          const enters = (context.sharedData?.get("ub:enters") || 0) + 1;
          context.sharedData?.set("ub:enters", enters);
          context.sharedData?.set("ub:enterTs", Date.now());
        } catch {}
      },
      onLeaveViewport: (context: PluginContext) => {
        if (!enabled) return;
        const img = context.imageRef?.current as any;
        if (img) {
          const enterTs = img.__lliUBEnterTs || 0;
          if (enterTs) img.__lliUBDwell = (img.__lliUBDwell || 0) + (Date.now() - enterTs);
          img.__lliUBEnterTs = 0;
          img.__lliUBLeaves = (img.__lliUBLeaves || 0) + 1;
        }
        try {
          const leaves = (context.sharedData?.get("ub:leaves") || 0) + 1;
          context.sharedData?.set("ub:leaves", leaves);
          const sdEnterTs = context.sharedData?.get("ub:enterTs") || 0;
          if (sdEnterTs) {
            const dwell = (context.sharedData?.get("ub:dwell") || 0) + (Date.now() - sdEnterTs);
            context.sharedData?.set("ub:dwell", dwell);
            context.sharedData?.set("ub:enterTs", 0);
          }
        } catch {}
      },
      onUnmount: (context: PluginContext) => {
        if (!enabled) return;

        const img = context.imageRef?.current as any;
        // 尝试移除事件监听（若仍存在）
        if (img && img.__lliUBClickHandler) {
          try { img.removeEventListener("click", img.__lliUBClickHandler); } catch {}
        }

        // 计算驻留：优先使用 img 上的最新数据，其次使用 sharedData 兜底
        const sdEnterTs = context.sharedData?.get("ub:enterTs") || 0;
        const dwellShared = (context.sharedData?.get("ub:dwell") || 0) + (sdEnterTs ? Date.now() - sdEnterTs : 0);
        const dwellImg = img
          ? (img.__lliUBDwell || 0) + (img.__lliUBEnterTs ? Date.now() - img.__lliUBEnterTs : 0)
          : 0;
        const clicks = img?.__lliUBClicks ?? (context.sharedData?.get("ub:clicks") || 0);
        const enters = img?.__lliUBEnters ?? (context.sharedData?.get("ub:enters") || 0);
        const leaves = img?.__lliUBLeaves ?? (context.sharedData?.get("ub:leaves") || 0);

        const data = {
          src: context.src,
          dwellMs: dwellImg || dwellShared || 0,
          clicks,
          enters,
          leaves,
        };

        try {
          // eslint-disable-next-line
          onReport ? onReport(data) : console.log("[UserBehavior]", data);
        } catch {}

        // 清理 img 上的自定义字段
        if (img) {
          delete img.__lliUBClickHandler;
          delete img.__lliUBClicks;
          delete img.__lliUBEnterTs;
          delete img.__lliUBDwell;
          delete img.__lliUBEnters;
          delete img.__lliUBLeaves;
        }
        // 清理 sharedData
        try {
          context.sharedData?.delete("ub:clicks");
          context.sharedData?.delete("ub:dwell");
          context.sharedData?.delete("ub:enters");
          context.sharedData?.delete("ub:leaves");
          context.sharedData?.delete("ub:enterTs");
        } catch {}
      },
      renderOverlay: (context: PluginContext) => {
        if (!enabled) return null;
        const Overlay: React.FC = () => {
          const [state, setState] = React.useState({
            dwellMs: 0,
            clicks: 0,
            enters: 0,
            leaves: 0,
            inView: false,
          });
          React.useEffect(() => {
            let alive = true;
            let raf = 0 as any;
            const tick = () => {
              if (!alive) return;
              const img = context.imageRef?.current as any;
              const enterTs = img?.__lliUBEnterTs || 0;
              const dwellImg = (img?.__lliUBDwell || 0) + (enterTs ? Date.now() - enterTs : 0);
              const sdEnterTs = context.sharedData?.get("ub:enterTs") || 0;
              const dwellShared = (context.sharedData?.get("ub:dwell") || 0) + (sdEnterTs ? Date.now() - sdEnterTs : 0);
              const dwell = dwellImg || dwellShared || 0;
              setState({
                dwellMs: dwell,
                clicks: img?.__lliUBClicks ?? (context.sharedData?.get("ub:clicks") || 0),
                enters: img?.__lliUBEnters ?? (context.sharedData?.get("ub:enters") || 0),
                leaves: img?.__lliUBLeaves ?? (context.sharedData?.get("ub:leaves") || 0),
                inView: context.isIntersecting,
              });
              raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
            return () => {
              alive = false;
              try { cancelAnimationFrame(raf); } catch {}
            };
          }, [context]);

          const style: React.CSSProperties = {
            position: "absolute",
            top: 8,
            right: 8,
            background: "rgba(30,144,255,0.85)",
            color: "#fff",
            fontSize: 12,
            padding: "6px 8px",
            borderRadius: 6,
            zIndex: 5,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            lineHeight: 1.4,
          };
          const dot = (ok: boolean) => (
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 8, background: ok ? "#4caf50" : "#f44336", marginRight: 6 }} />
          );
          return (
            <div style={style}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
                {dot(state.inView)}<strong>视口</strong>
              </div>
              <div>驻留：{Math.round(state.dwellMs / 100) / 10}s</div>
              <div>点击：{state.clicks}</div>
              <div>进入：{state.enters}，离开：{state.leaves}</div>
              <div style={{ marginTop: 4, opacity: 0.85 }}>提示：点击或慢慢滚动</div>
            </div>
          );
        };
        return <Overlay />;
      },
    },
  };
}