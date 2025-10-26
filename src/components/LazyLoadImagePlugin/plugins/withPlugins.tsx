/**
 * withPlugins（扩展版）
 * 为 LazyLoadImageCore 注入插件系统，支持 Hook 工厂与插件总线
 */

import type {
  DeviceInfo,
  LazyImagePlugin,
  NetworkInfo,
  PluginContext,
  PluginManager,
} from "./types";
import type {
  LazyLoadImageCoreProps,
  LazyLoadImageCoreRef,
} from "../core/LazyLoadImageCore";
import React, { forwardRef, useCallback, useEffect, useMemo, useRef } from "react";
// 🚀 性能优化：使用全局单例缓存网络和设备信息
import {
  addGlobalContextListener,
  getGlobalDeviceInfo,
  getGlobalNetworkInfo
} from "../utils/GlobalContext";

import { PluginErrorBoundary } from "./PluginErrorBoundary"; // Issue #4
// Issue #6: 导入配置类型
import type { PluginManagerConfig } from "./types";
import { createPluginBus } from "./PluginBus";
import { createPluginManager } from "./PluginManager";

export interface WithPluginsConfig {
  plugins: LazyImagePlugin[];
  enableDebug?: boolean;
  // Issue #6: 插件管理器配置
  pluginManagerConfig?: PluginManagerConfig;
}

// Issue #8: 插件指纹函数（用于去重和冲突检测）
function getPluginFingerprint(plugin: LazyImagePlugin): string {
  const configHash = plugin.config ? JSON.stringify(plugin.config) : "";
  return `${plugin.name}@${plugin.version || "0.0.0"}#${configHash}`;
}

// Issue #10: 节流函数
function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}

// 🚀 性能优化：detectNetwork 和 detectDevice 已移至 GlobalContext
// 使用全局单例避免每个组件实例重复检测（100张图片 = 100次检测 → 1次检测）

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

  const { plugins, enableDebug = false, pluginManagerConfig } = normalized;

  const WithPluginsComponent = forwardRef<
    LazyLoadImageCoreRef,
    LazyLoadImageCoreProps
  >((props, ref) => {
    const { src } = props;

    // Issue #6: 实例级插件管理，传递配置
    const pluginManagerRef = useRef<PluginManager>(
      createPluginManager({
        conflictStrategy: pluginManagerConfig?.conflictStrategy || "warn",
        enableDebug: pluginManagerConfig?.enableDebug ?? enableDebug,
      })
    );
    const pluginManager = pluginManagerRef.current;

    const busRef = useRef(createPluginBus());
    const bus = busRef.current;

    // Issue #8: 使用 ref 缓存已注册的插件指纹，实现增量注册
    const registeredPluginsRef = useRef<Map<string, LazyImagePlugin>>(new Map());

    // 初始化 Hook 工厂实例并注入 + 注册插件（按插件列表变化执行）
    useEffect(() => {
      // Issue #8: 增量注册 - 计算当前和已注册的插件指纹
      const currentFingerprints = new Set(plugins.map(getPluginFingerprint));
      const registeredFingerprints = new Set(registeredPluginsRef.current.keys());

      // 找出需要新增的插件
      const toAdd = plugins.filter((p) => {
        const fp = getPluginFingerprint(p);
        return !registeredFingerprints.has(fp);
      });

      // 找出需要移除的插件
      const toRemove: string[] = [];
      registeredPluginsRef.current.forEach((plugin, fp) => {
        if (!currentFingerprints.has(fp)) {
          toRemove.push(plugin.name);
        }
      });

      // 注册新插件
      toAdd.forEach((plugin) => {
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
        registeredPluginsRef.current.set(getPluginFingerprint(plugin), plugin);

        if (enableDebug) {
          console.debug(`[withPlugins] Registered plugin: ${plugin.name}@${plugin.version || "0.0.0"}`);
        }
      });

      // 注销移除的插件
      toRemove.forEach((name) => {
        pluginManager.unregister(name);
        // 从 ref 中移除
        registeredPluginsRef.current.forEach((p, fp) => {
          if (p.name === name) {
            registeredPluginsRef.current.delete(fp);
          }
        });

        if (enableDebug) {
          console.debug(`[withPlugins] Unregistered plugin: ${name}`);
        }
      });

      // 清理函数：组件卸载时注销所有插件
      return () => {
        registeredPluginsRef.current.forEach((plugin) => {
          pluginManager.unregister(plugin.name);
        });
        registeredPluginsRef.current.clear();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plugins, pluginManager, bus, enableDebug]);

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

    // 🚀 性能优化：使用全局单例获取网络与设备信息
    // 100 张图片从 100 次检测减少到 1 次检测（-99% 性能提升）
    const [networkInfo, setNetworkInfo] = React.useState<NetworkInfo | undefined>(
      () => getGlobalNetworkInfo()
    );
    const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>(
      () => getGlobalDeviceInfo()
    );

    // Issue #5: 拆分细粒度上下文，减少不必要的重建
    // 1. 静态上下文（很少变化）
    const staticContext = useMemo(
      () => ({
        src,
        containerRef,
        imageRef,
        bus,
        sharedData: sharedDataRef.current,
      }),
      [src, bus] // 仅依赖 src 和 bus
    );

    // 2. 动态上下文（按需变化）
    const dynamicContext = useMemo(
      () => ({
        networkInfo,
        deviceInfo,
      }),
      [networkInfo, deviceInfo]
    );

    // 3. 状态上下文（高频变化）
    const stateContext = useMemo(
      () => ({
        imageState,
        isIntersecting,
      }),
      [imageState, isIntersecting]
    );

    // 4. 性能数据上下文（独立管理）
    const performanceContextRef = useRef({
      loadStartTime: 0,
      loadEndTime: undefined as number | undefined,
      duration: undefined as number | undefined,
    });

    // 5. 合并函数：按需组合完整上下文
    const getFullContext = (): PluginContext => ({
      ...staticContext,
      ...dynamicContext,
      ...stateContext,
      props: props as LazyLoadImageCoreProps,
      performanceData: performanceContextRef.current,
    });

    // 6. 为兼容性保留一个完整的 pluginContext（但现在重建频率大幅降低）
    const pluginContext: PluginContext = useMemo(
      () => getFullContext(),
      [staticContext, dynamicContext, stateContext, props]
    );

    // transformProps 链式处理
    const transformedProps = useMemo(() => {
      let p = { ...props } as LazyLoadImageCoreProps;
      plugins.forEach((plugin) => {
        if (plugin && plugin.hooks && plugin.hooks.transformProps) {
          p = plugin.hooks.transformProps(p);
        }
      });
      return p;
    }, [props, plugins]);

    // Issue #11: 安全的依赖哈希函数（避免循环引用）
    const safeDepsHash = (deps: any[]): string => {
      try {
        return JSON.stringify(deps, (key, value) => {
          // 跳过不可序列化的对象
          if (value instanceof HTMLElement) return '[HTMLElement]';
          if (value && typeof value === 'object' && 'current' in value) return '[Ref]';
          if (typeof value === 'function') return '[Function]';
          if (value instanceof Map) return '[Map]';
          if (value instanceof Set) return '[Set]';
          return value;
        });
      } catch (error) {
        // 如果仍然失败，使用简单的字符串拼接
        return deps.map((d, i) => `${i}:${typeof d}`).join(',');
      }
    };

    // Issue #11: 精细化渲染缓存 - 缓存每个插件的依赖和渲染结果
    const prevDepsRef = useRef<Map<string, string>>(new Map());
    const renderCacheRef = useRef<Map<string, React.ReactNode>>(new Map());
    const overlayCacheRef = useRef<Map<string, React.ReactNode>>(new Map());

    // Issue #4 + Issue #11: 渲染聚合（带错误边界保护 + 精细缓存）
    const pluginRenders = useMemo(() => {
      const currentDeps = new Map<string, string>();

      return plugins
        .filter((plugin) => plugin && plugin.hooks) // 过滤无效插件
        .map((plugin, idx) => {
          const pluginKey = `${plugin.name}-${idx}`;

          // 计算当前依赖
          const deps = plugin.renderDeps
            ? plugin.renderDeps(pluginContext)
            : [staticContext, dynamicContext, stateContext]; // 默认依赖拆分后的上下文
          const depsHash = safeDepsHash(deps);
          currentDeps.set(pluginKey, depsHash);

          // 检查依赖是否变化
          const prevDepsHash = prevDepsRef.current.get(pluginKey);
          const depsChanged = prevDepsHash !== depsHash;

          // 如果依赖未变化且有缓存，直接返回缓存
          if (!depsChanged && renderCacheRef.current.has(pluginKey)) {
            return renderCacheRef.current.get(pluginKey);
          }

          // 依赖变化或无缓存，重新渲染
          const node = plugin.hooks.render?.(pluginContext);
          if (!node) {
            renderCacheRef.current.delete(pluginKey);
            return null;
          }

          const wrapped = (
            <PluginErrorBoundary key={pluginKey} pluginName={plugin.name}>
              {node}
            </PluginErrorBoundary>
          );

          renderCacheRef.current.set(pluginKey, wrapped);
          return wrapped;
        })
        .filter(Boolean);

      // 更新依赖记录（在最后更新，确保渲染完成）
      prevDepsRef.current = currentDeps;

      return plugins
        .map((plugin, idx) => {
          const pluginKey = `${plugin.name}-${idx}`;
          return renderCacheRef.current.get(pluginKey);
        })
        .filter(Boolean);
    }, [plugins, pluginContext, staticContext, dynamicContext, stateContext]);

    // Issue #4 + Issue #11: 叠加层渲染（带错误边界保护 + 精细缓存）
    const pluginOverlays = useMemo(() => {
      return plugins
        .filter((plugin) => plugin && plugin.hooks) // 过滤无效插件
        .map((plugin, idx) => {
          const pluginKey = `${plugin.name}-overlay-${idx}`;

          // 计算当前依赖（使用相同的 renderDeps）
          const deps = plugin.renderDeps
            ? plugin.renderDeps(pluginContext)
            : [staticContext, dynamicContext, stateContext];
          const depsHash = safeDepsHash(deps);

          // 检查依赖是否变化
          const prevDepsHash = prevDepsRef.current.get(pluginKey);
          const depsChanged = prevDepsHash !== depsHash;

          // 如果依赖未变化且有缓存，直接返回缓存
          if (!depsChanged && overlayCacheRef.current.has(pluginKey)) {
            return overlayCacheRef.current.get(pluginKey);
          }

          // 依赖变化或无缓存，重新渲染
          const node = plugin.hooks.renderOverlay?.(pluginContext);
          if (!node) {
            overlayCacheRef.current.delete(pluginKey);
            prevDepsRef.current.set(pluginKey, depsHash);
            return null;
          }

          const wrapped = (
            <PluginErrorBoundary key={pluginKey} pluginName={plugin.name}>
              {node}
            </PluginErrorBoundary>
          );

          overlayCacheRef.current.set(pluginKey, wrapped);
          prevDepsRef.current.set(pluginKey, depsHash);
          return wrapped;
        })
        .filter(Boolean);
    }, [plugins, pluginContext, staticContext, dynamicContext, stateContext]);

    // 生命周期钩子（挂载/卸载，仅运行一次）
    useEffect(() => {
      const cleanups: Array<void | (() => void)> = [];
      // Issue #5: onMount 时获取初始上下文
      const mountContext = getFullContext();
      plugins
        .filter((plugin) => plugin && plugin.hooks) // 过滤无效插件
        .forEach((plugin) => {
          const cleanup = plugin.hooks.onMount?.(mountContext);
          if (cleanup) cleanups.push(cleanup);
        });

      // 订阅进度事件并广播到 onProgress 钩子（若有实现）
      const offProgress = bus.on("progress", (progress) => {
        // Issue #5: 获取最新上下文执行钩子
        const ctx = getFullContext();
        pluginManager.executeHook("onProgress", ctx, progress).catch(() => {});
      });

      return () => {
        // Issue #5: onUnmount 时获取最终上下文
        const unmountContext = getFullContext();
        plugins
          .filter((plugin) => plugin && plugin.hooks) // 过滤无效插件
          .forEach((plugin) => plugin.hooks.onUnmount?.(unmountContext));
        // 注销插件，避免泄漏与重复初始化
        plugins
          .filter((plugin) => plugin) // 过滤无效插件
          .forEach((plugin) => pluginManager.unregister(plugin.name));
        cleanups.forEach((fn) => typeof fn === "function" && fn());
        // 取消订阅进度事件
        if (offProgress) {
          offProgress();
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 当 src 变更时触发 onSrcChange（若插件实现该钩子）
    const prevSrcRef = useRef(src);
    useEffect(() => {
      const oldSrc = prevSrcRef.current;
      if (oldSrc !== src) {
        // Issue #5: 获取最新上下文执行钩子
        const ctx = getFullContext();
        pluginManager
          .executeHook("onSrcChange", ctx, oldSrc, src)
          .catch(() => {});
        prevSrcRef.current = src;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    // 🚀 性能优化：订阅全局上下文变化（集中监听，避免每个组件重复注册监听器）
    // 100 个组件从 200 个监听器减少到 2 个（-99% 监听器数量）
    useEffect(() => {
      const unsubscribe = addGlobalContextListener(() => {
        // 全局网络或设备信息变化时，更新本地状态
        const newNetworkInfo = getGlobalNetworkInfo();
        const newDeviceInfo = getGlobalDeviceInfo();

        setNetworkInfo(newNetworkInfo);
        setDeviceInfo(newDeviceInfo);

        // 触发插件钩子
        const ctx = getFullContext();
        pluginManager.executeHook("onNetworkChange", ctx, newNetworkInfo).catch(() => {});
        pluginManager.executeHook("onResize", ctx, newDeviceInfo).catch(() => {});
      });

      return unsubscribe; // 清理订阅
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 🔥 修复无限循环：使用 useCallback 包裹所有回调函数，确保引用稳定
    const handleBeforeLoad = useCallback(async () => {
      const ctx = getFullContext();
      const result = await pluginManager.executeHook("onLoad", ctx);
      return result as string | undefined;
    }, []); // getFullContext 和 pluginManager 都是稳定的

    const handleLoadStart = useCallback(() => {
      setImageState({ isIdle: false, isLoading: true, isLoaded: false, isError: false });
      performanceContextRef.current.loadStartTime = performance.now();
      const ctx = getFullContext();
      pluginManager.executeHook("onBeforeLoad", ctx).catch(() => {});
    }, []);

    const handleLoadSuccess = useCallback((displaySrc?: string) => {
      setImageState({ isIdle: false, isLoading: false, isLoaded: true, isError: false });
      performanceContextRef.current.loadEndTime = performance.now();
      performanceContextRef.current.duration =
        performanceContextRef.current.loadEndTime - performanceContextRef.current.loadStartTime;
      const ctx = getFullContext();
      pluginManager.executeHook("onLoadSuccess", ctx, displaySrc).catch(() => {});
    }, []);

    const handleLoadError = useCallback((error: Error | Event) => {
      setImageState({ isIdle: false, isLoading: false, isLoaded: false, isError: true });
      const ctx = getFullContext();
      pluginManager.executeHook("onLoadError", ctx, error).catch(() => {});
    }, []);

    const handleEnterViewport = useCallback(() => {
      setIsIntersecting(true);
      const ctx = getFullContext();
      pluginManager.executeHook("onEnterViewport", ctx).catch(() => {});
    }, []);

    const handleLeaveViewport = useCallback(() => {
      setIsIntersecting(false);
      const ctx = getFullContext();
      pluginManager.executeHook("onLeaveViewport", ctx).catch(() => {});
    }, []);

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
      onBeforeLoad: handleBeforeLoad,
      onLoadStart: handleLoadStart,
      onLoadSuccess: handleLoadSuccess,
      onLoadError: handleLoadError,
      onEnterViewport: handleEnterViewport,
      onLeaveViewport: handleLeaveViewport,
    };

    return <WrappedComponent ref={ref} {...enhancedProps} />;
  });

  WithPluginsComponent.displayName = "WithPlugins(LazyLoadImageCore)";
  return WithPluginsComponent;
}