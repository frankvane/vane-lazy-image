/**
 * 插件系统类型定义（扩展版）
 * 兼容 PLUGIN_CATALOG 与 PLUGIN_SYSTEM_SCALABILITY_ANALYSIS 文档需求
 */

import type { LazyLoadImageCoreProps } from "../core/LazyLoadImageCore";
import type React from "react";

// ============ 扩展数据类型 ============
export interface ProgressInfo {
  loaded: number;
  total: number;
  percent: number; // 0~100
  indeterminate?: boolean; // 当无法获取总大小时为 true
}

export interface NetworkInfo {
  effectiveType: "4g" | "3g" | "2g" | "slow-2g";
  downlink: number; // Mbps
  rtt: number; // ms
  saveData: boolean;
}

export interface DeviceInfo {
  type: "mobile" | "tablet" | "desktop";
  os: string;
  browser: string;
  devicePixelRatio: number;
  viewportWidth: number;
  viewportHeight: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export type InteractionType = "click" | "hover" | "focus" | "touch";

// ============ 插件通信总线 ============
export interface PluginBus {
  emit: (event: string, data: any) => void;
  on: (event: string, handler: (data: any) => void) => () => void;
  getData: (key: string) => any;
  setData: (key: string, value: any) => void;
}

// ============ 插件上下文 ============
export interface UseImageStateReturnLike {
  isIdle: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
}

export interface PluginContext {
  src: string;
  imageState: UseImageStateReturnLike;
  containerRef: React.RefObject<HTMLElement | null>;
  imageRef?: React.RefObject<HTMLImageElement | null>;
  isIntersecting: boolean;
  props: LazyLoadImageCoreProps;
  bus?: PluginBus;

  // 扩展上下文
  networkInfo?: NetworkInfo;
  deviceInfo?: DeviceInfo;
  dimensions?: {
    width: number;
    height: number;
    naturalWidth?: number;
    naturalHeight?: number;
  };
  performanceData?: {
    loadStartTime: number;
    loadEndTime?: number;
    duration?: number;
    size?: number;
  };
  sharedData?: Map<string, any>;
}

// ============ 插件钩子 ============
export interface PluginHooks {
  // 现有钩子
  onBeforeLoad?: (context: PluginContext) => boolean | Promise<boolean>;
  onLoad?: (
    context: PluginContext
  ) => string | Promise<string | undefined> | undefined;
  onLoadSuccess?: (
    context: PluginContext,
    displaySrc: string
  ) => void | Promise<void>;
  onLoadError?: (
    context: PluginContext,
    error: Error
  ) => boolean | Promise<boolean>;
  onEnterViewport?: (context: PluginContext) => void;
  onLeaveViewport?: (context: PluginContext) => void;
  onMount?: (context: PluginContext) => void | (() => void);
  onUnmount?: (context: PluginContext) => void;
  render?: (context: PluginContext) => React.ReactNode;
  // 新增：用于渲染覆盖在图片上的叠加层（进度、遮罩等）
  renderOverlay?: (context: PluginContext) => React.ReactNode;
  transformProps?: (props: LazyLoadImageCoreProps) => LazyLoadImageCoreProps;

  // 新增高优先级钩子
  onProgress?: (context: PluginContext, progress: ProgressInfo) => void;
  onRetry?: (
    context: PluginContext,
    retryCount: number,
    maxRetries: number
  ) => void;
  onSrcChange?: (context: PluginContext, oldSrc: string, newSrc: string) => void;
  onNetworkChange?: (context: PluginContext, networkInfo: NetworkInfo) => void;

  // 中优先级钩子
  onVisibilityChange?: (context: PluginContext, isVisible: boolean) => void;
  onResize?: (context: PluginContext, dimensions: Dimensions) => void;
  onInteraction?: (context: PluginContext, interactionType: InteractionType) => void;
  onAbort?: (context: PluginContext) => void;

  // 低优先级钩子
  onDecode?: (context: PluginContext) => void;
  onPaint?: (context: PluginContext) => void;
}

export interface LazyImagePlugin {
  name: string;
  version?: string;
  hooks: PluginHooks;
  config?: Record<string, any>;

  // Hook 工厂（用于按需初始化底层功能实例）
  hookFactory?: {
    create: (config: any) => any;
    inject: (plugin: LazyImagePlugin, hookInstance: any) => void;
  };

  init?: () => void | Promise<void>;
  destroy?: () => void | Promise<void>;
}

export interface PluginManager {
  register: (plugin: LazyImagePlugin) => void;
  unregister: (pluginName: string) => void;
  getPlugin: (pluginName: string) => LazyImagePlugin | undefined;
  getAllPlugins: () => LazyImagePlugin[];
  executeHook: <K extends keyof PluginHooks>(
    hookName: K,
    context: PluginContext,
    ...args: any[]
  ) => Promise<any>;
}