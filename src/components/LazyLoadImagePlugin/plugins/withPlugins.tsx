/**
 * withPlugins（扩展版）
 * 为 LazyLoadImageCore 注入插件系统，支持 Hook 工厂与插件总线
 */

import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import type {
  LazyImagePlugin,
  PluginContext,
  PluginManager,
  NetworkInfo,
  DeviceInfo,
} from "./types";
import type {
  LazyLoadImageCoreProps,
  LazyLoadImageCoreRef,
} from "../core/LazyLoadImageCore";

import { createPluginBus } from "./PluginBus";
import { createPluginManager } from "./PluginManager";

export interface WithPluginsConfig {
  plugins: LazyImagePlugin[];
  enableDebug?: boolean;
}

function detectNetwork(): NetworkInfo | undefined {
  // 浏览器 Network Information API
  const nav: any = typeof navigator !== "undefined" ? navigator : undefined;
  const conn = nav?.connection || nav?.mozConnection || nav?.webkitConnection;
  if (!conn) return undefined;
  return {
    effectiveType: conn.effectiveType || "4g",
    downlink: Number(conn.downlink || 10),
    rtt: Number(conn.rtt || 50),
    saveData: Boolean(conn.saveData || false),
  };
}

function detectDevice(): DeviceInfo {
  const width = typeof window !== "undefined" ? window.innerWidth : 1024;
  const height = typeof window !== "undefined" ? window.innerHeight : 768;
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";

  const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  const isTablet = /iPad|Tablet/i.test(ua);
  const type: DeviceInfo["type"] = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

  return {
    type,
    os: ua,
    browser: ua,
    devicePixelRatio: dpr,
    viewportWidth: width,
    viewportHeight: height,
  };
}

export function withPlugins(
  WrappedComponent: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<LazyLoadImageCoreProps> &
      React.RefAttributes<LazyLoadImageCoreRef>
  >,
  config: WithPluginsConfig | LazyImagePlugin[]
) {
  const normalized: WithPluginsConfig = Array.isArray(config)
    ? { plugins: config, enableDebug: false }
    : config;

  const { plugins, enableDebug = false } = normalized;

  const WithPluginsComponent = forwardRef<
    LazyLoadImageCoreRef,
    LazyLoadImageCoreProps
  >((props, ref) => {
    const { src } = props;

    // 实例级插件管理
    const pluginManagerRef = useRef<PluginManager>(createPluginManager());
    const pluginManager = pluginManagerRef.current;
    const busRef = useRef(createPluginBus());
    const bus = busRef.current;

    // 初始化 Hook 工厂实例并注入 + 注册插件（按插件列表变化执行）
    useEffect(() => {
      plugins.forEach((plugin) => {
        if (plugin.hookFactory) {
          const instance = plugin.hookFactory.create(plugin.config || {});
          plugin.hookFactory.inject(plugin, instance);
          // 调试模式下将实例写入总线，便于排查问题
          if (enableDebug) {
            bus.setData(`hook:${plugin.name}`, instance);
          }
        }
        // 注册插件
        pluginManager.register(plugin);
      });

      return () => {
        // 插件列表变更时先注销旧插件，避免重复注册
        plugins.forEach((plugin) => pluginManager.unregister(plugin.name));
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plugins]);

    // 调试：打印当前插件列表
    useEffect(() => {
      if (enableDebug) {
        try {
          // 简要输出插件名称，便于快速确认注入情况
          const names = plugins.map((p) => p.name);
          // eslint-disable-next-line no-console
          console.debug("[withPlugins] active plugins:", names);
        } catch {}
      }
    }, [enableDebug, plugins]);

    // refs
    const containerRef = useRef<HTMLElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const sharedDataRef = useRef<Map<string, any>>(new Map());

    // 轻量状态（由核心维护真实状态，此处仅同步）
    const [imageState, setImageState] = React.useState({
      isIdle: true,
      isLoading: false,
      isLoaded: false,
      isError: false,
    });

    // 视口状态（用于插件上下文）
    const [isIntersecting, setIsIntersecting] = React.useState(false);

    // 网络与设备信息
    const networkInfo = useMemo(() => detectNetwork(), []);
    const deviceInfo = useMemo(() => detectDevice(), []);

    // 构造插件上下文
    const pluginContext: PluginContext = useMemo(
      () => ({
        src,
        imageState,
        containerRef,
        imageRef,
        isIntersecting, // 由核心触发可见性钩子
        props: props as LazyLoadImageCoreProps,
        bus,
        networkInfo,
        deviceInfo,
        performanceData: {
          loadStartTime: 0,
        },
        sharedData: sharedDataRef.current,
      }),
      [src, imageState, props, bus, networkInfo, deviceInfo, isIntersecting]
    );

    // transformProps 链式处理
    const transformedProps = useMemo(() => {
      let p = { ...props } as LazyLoadImageCoreProps;
      plugins.forEach((plugin) => {
        if (plugin.hooks.transformProps) {
          p = plugin.hooks.transformProps(p);
        }
      });
      return p;
    }, [props, plugins]);

    // 渲染聚合
    const pluginRenders = useMemo(() => {
      return plugins
        .map((plugin, idx) => {
          const node = plugin.hooks.render?.(pluginContext);
          if (!node) return null;
          return (
            <React.Fragment key={`plugin-render-${plugin.name}-${idx}`}>
              {node}
            </React.Fragment>
          );
        })
        .filter(Boolean);
    }, [pluginContext, plugins]);

    // 叠加层渲染（如进度条、遮罩等）
    const pluginOverlays = useMemo(() => {
      return plugins
        .map((plugin, idx) => {
          const node = plugin.hooks.renderOverlay?.(pluginContext);
          if (!node) return null;
          return (
            <React.Fragment key={`plugin-overlay-${plugin.name}-${idx}`}>
              {node}
            </React.Fragment>
          );
        })
        .filter(Boolean);
    }, [pluginContext, plugins]);

    // 生命周期钩子（挂载/卸载，仅运行一次）
    useEffect(() => {
      const cleanups: Array<void | (() => void)> = [];
      plugins.forEach((plugin) => {
        const cleanup = plugin.hooks.onMount?.(pluginContext);
        if (cleanup) cleanups.push(cleanup);
      });

      // 订阅进度事件并广播到 onProgress 钩子（若有实现）
      const offProgress = bus.on("progress", (progress) => {
        // 广播给所有实现了 onProgress 的插件
        pluginManager.executeHook("onProgress", pluginContext, progress).catch(() => {});
      });

      return () => {
        plugins.forEach((plugin) => plugin.hooks.onUnmount?.(pluginContext));
        // 注销插件，避免泄漏与重复初始化
        plugins.forEach((plugin) => pluginManager.unregister(plugin.name));
        cleanups.forEach((fn) => typeof fn === "function" && fn());
        // 取消订阅进度事件
        offProgress && offProgress();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 当 src 变更时触发 onSrcChange（若插件实现该钩子）
    const prevSrcRef = useRef(src);
    useEffect(() => {
      const oldSrc = prevSrcRef.current;
      if (oldSrc !== src) {
        pluginManager
          .executeHook("onSrcChange", pluginContext, oldSrc, src)
          .catch(() => {});
        prevSrcRef.current = src;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    // 注入核心回调以触发插件钩子
    const enhancedProps: LazyLoadImageCoreProps = {
      ...transformedProps,
      // 将外部 refs 传递给核心以便插件能操作真实 DOM
      containerRefExternal: containerRef as React.RefObject<HTMLDivElement | null>,
      imageRefExternal: imageRef,
      children: (
        <>
          {transformedProps.children}
          {pluginRenders}
          {pluginOverlays}
        </>
      ),
      onBeforeLoad: async () => {
        // 调用所有插件的 onLoad（可返回缓存/替代 src）
        const result = await pluginManager.executeHook("onLoad", pluginContext);
        return result as string | undefined;
      },
      onLoadStart: () => {
        setImageState({ isIdle: false, isLoading: true, isLoaded: false, isError: false });
        pluginManager.executeHook("onBeforeLoad", pluginContext).catch(() => {});
        // 记录开始时间
        pluginContext.performanceData!.loadStartTime = performance.now();
      },
      onLoadSuccess: (displaySrc) => {
        setImageState({ isIdle: false, isLoading: false, isLoaded: true, isError: false });
        pluginContext.performanceData!.loadEndTime = performance.now();
        const pd = pluginContext.performanceData!;
        pd.duration = (pd.loadEndTime || 0) - (pd.loadStartTime || 0);
        pluginManager.executeHook("onLoadSuccess", pluginContext, displaySrc).catch(() => {});
      },
      onLoadError: (error) => {
        setImageState({ isIdle: false, isLoading: false, isLoaded: false, isError: true });
        pluginManager.executeHook("onLoadError", pluginContext, error).catch(() => {});
      },
      onEnterViewport: () => {
        setIsIntersecting(true);
        pluginManager.executeHook("onEnterViewport", pluginContext).catch(() => {});
      },
      onLeaveViewport: () => {
        setIsIntersecting(false);
        pluginManager.executeHook("onLeaveViewport", pluginContext).catch(() => {});
      },
    };

    return <WrappedComponent ref={ref} {...enhancedProps} />;
  });

  WithPluginsComponent.displayName = "WithPlugins(LazyLoadImageCore)";
  return WithPluginsComponent;
}