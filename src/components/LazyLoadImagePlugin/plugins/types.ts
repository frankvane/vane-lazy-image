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
  // Issue #27: 增强进度信息
  /** 下载速度（字节/秒） */
  speed?: number;
  /** 预计剩余时间（秒） */
  estimatedTime?: number;
  /** 时间戳（毫秒） */
  timestamp?: number;
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

/**
 * 插件事件定义（Issue #19: 类型安全的事件系统）
 */
export interface PluginBusEvents {
  // 图片事件
  'image:load': { src: string; timestamp: number };
  'image:error': { src: string; error: Error };
  'image:progress': { src: string; progress: ProgressInfo };

  // 插件事件
  'plugin:registered': { name: string; version?: string };
  'plugin:unregistered': { name: string };

  // 视口事件
  'viewport:enter': { src: string; entry?: IntersectionObserverEntry };
  'viewport:leave': { src: string; entry?: IntersectionObserverEntry };

  // 网络事件
  'network:change': { networkInfo: NetworkInfo };

  // 自定义事件（允许任意事件）
  [key: string]: any;
}

/**
 * 类型安全的插件总线（Issue #19）
 * @template Events - 事件类型映射
 */
export interface TypedPluginBus<Events extends Record<string, any> = PluginBusEvents> {
  /**
   * 发送事件
   * @template E - 事件名称类型
   * @param eventName - 事件名称
   * @param data - 事件数据
   */
  emit<E extends keyof Events>(eventName: E, data: Events[E]): void;

  /**
   * 监听事件
   * @template E - 事件名称类型
   * @param eventName - 事件名称
   * @param handler - 事件处理函数
   * @returns 取消监听的函数
   */
  on<E extends keyof Events>(
    eventName: E,
    handler: (data: Events[E]) => void
  ): () => void;

  /**
   * 一次性监听事件
   * @template E - 事件名称类型
   * @param eventName - 事件名称
   * @param handler - 事件处理函数
   * @returns 取消监听的函数
   */
  once<E extends keyof Events>(
    eventName: E,
    handler: (data: Events[E]) => void
  ): () => void;

  /**
   * 移除事件监听器
   * @template E - 事件名称类型
   * @param eventName - 事件名称
   * @param handler - 可选的特定处理函数
   */
  off<E extends keyof Events>(
    eventName: E,
    handler?: (data: Events[E]) => void
  ): void;

  /**
   * 清空监听器
   * @param eventName - 可选的事件名称，如果不提供则清空所有
   */
  clear(eventName?: keyof Events): void;

  /**
   * 获取共享数据
   * @param key - 数据键
   * @returns 数据值
   */
  getData: (key: string) => any;

  /**
   * 设置共享数据
   * @param key - 数据键
   * @param value - 数据值
   */
  setData: (key: string, value: any) => void;
}

/**
 * Issue #25: 监听器信息（用于调试）
 */
export interface ListenerInfo {
  /** 事件名称 */
  event: string;
  /** 监听器数量 */
  count: number;
  /** 是否为通配符事件 */
  isWildcard: boolean;
  /** 注册来源（如果启用调试模式） */
  sources?: string[];
}

/**
 * Issue #25: PluginBus 配置
 */
export interface PluginBusConfig {
  /** 是否启用调试模式（跟踪监听器来源） */
  debug?: boolean;
  /** 是否在控制台警告未清理的监听器 */
  warnUncleared?: boolean;
  /** 需要批处理的事件名称集合 */
  batchEvents?: Set<string>;
}

/**
 * 插件总线接口（向后兼容）
 */
export interface PluginBus {
  emit: (event: string, data: any) => void;
  on: (event: string, handler: (data: any) => void) => () => void;
  // Issue #12: 一次性监听
  once: (event: string, handler: (data: any) => void) => () => void;
  // Issue #12: 移除监听器
  off: (event: string, handler?: (data: any) => void) => void;
  // Issue #12: 清空监听器
  clear: (event?: string) => void;
  getData: (key: string) => any;
  setData: (key: string, value: any) => void;
  // Issue #25: 获取活跃监听器信息（调试用）
  getActiveListeners?: () => ListenerInfo[];
  // Issue #25: 获取配置
  getConfig?: () => PluginBusConfig;
}

// ============ 插件上下文 ============
export interface UseImageStateReturnLike {
  isIdle: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
}

/**
 * 插件上下文接口
 * @template Config - 插件配置类型
 */
export interface PluginContext<Config = any> {
  src: string;
  imageState: UseImageStateReturnLike;
  containerRef: React.RefObject<HTMLElement | null>;
  imageRef?: React.RefObject<HTMLImageElement | null>;
  isIntersecting: boolean;
  props: LazyLoadImageCoreProps;
  bus?: PluginBus;

  // 插件配置（Issue #20: 类型安全的配置）
  config?: Config;

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
/**
 * 插件钩子接口（Issue #21: 严格化参数类型）
 * @template Config - 插件配置类型
 */
export interface PluginHooks<Config = any> {
  // ===== 生命周期钩子 =====

  /**
   * 组件挂载时触发
   * @param context - 插件上下文
   * @returns 可选的清理函数
   */
  onMount?: (context: PluginContext<Config>) => void | (() => void);

  /**
   * 组件卸载时触发
   * @param context - 插件上下文
   */
  onUnmount?: (context: PluginContext<Config>) => void;

  // ===== 加载钩子 =====

  /**
   * 加载前触发，可以阻止加载
   * @param context - 插件上下文
   * @returns true 继续加载，false 阻止加载
   */
  onBeforeLoad?: (context: PluginContext<Config>) => boolean | Promise<boolean>;

  /**
   * 自定义加载逻辑（如 fetch）
   * @param context - 插件上下文
   * @returns 图片 URL 或 undefined
   */
  onLoad?: (
    context: PluginContext<Config>
  ) => string | Promise<string | undefined> | undefined;

  /**
   * 加载成功时触发
   * @param context - 插件上下文
   * @param displaySrc - 最终显示的图片源（可能是 blob: URL、dataURL 或原始 URL）
   */
  onLoadSuccess?: (
    context: PluginContext<Config>,
    displaySrc: string
  ) => void | Promise<void>;

  /**
   * 加载失败时触发
   * @param context - 插件上下文
   * @param error - 错误对象或事件
   * @returns true 表示已处理错误，false 继续抛出
   */
  onLoadError?: (
    context: PluginContext<Config>,
    error: Error | Event
  ) => boolean | Promise<boolean>;

  // ===== 视口钩子 =====

  /**
   * 进入视口时触发
   * @param context - 插件上下文
   * @param entry - IntersectionObserver 条目（可选）
   */
  onEnterViewport?: (
    context: PluginContext<Config>,
    entry?: IntersectionObserverEntry
  ) => void;

  /**
   * 离开视口时触发
   * @param context - 插件上下文
   * @param entry - IntersectionObserver 条目（可选）
   */
  onLeaveViewport?: (
    context: PluginContext<Config>,
    entry?: IntersectionObserverEntry
  ) => void;

  // ===== 进度和重试钩子 =====

  /**
   * 加载进度更新时触发
   * @param context - 插件上下文
   * @param progress - 进度信息
   */
  onProgress?: (context: PluginContext<Config>, progress: ProgressInfo) => void;

  /**
   * 重试加载时触发
   * @param context - 插件上下文
   * @param retryCount - 当前重试次数
   * @param maxRetries - 最大重试次数
   */
  onRetry?: (
    context: PluginContext<Config>,
    retryCount: number,
    maxRetries: number
  ) => void;

  // ===== 变更钩子 =====

  /**
   * src 属性变化时触发
   * @param context - 插件上下文
   * @param oldSrc - 旧的 src
   * @param newSrc - 新的 src
   */
  onSrcChange?: (
    context: PluginContext<Config>,
    oldSrc: string,
    newSrc: string
  ) => void;

  /**
   * 网络状态变化时触发
   * @param context - 插件上下文
   */
  onNetworkChange?: (context: PluginContext<Config>) => void;

  /**
   * 可见性变化时触发
   * @param context - 插件上下文
   * @param isVisible - 是否可见
   */
  onVisibilityChange?: (
    context: PluginContext<Config>,
    isVisible: boolean
  ) => void;

  /**
   * 尺寸变化时触发
   * @param context - 插件上下文
   */
  onResize?: (context: PluginContext<Config>) => void;

  // ===== 交互和中断钩子 =====

  /**
   * 用户交互时触发
   * @param context - 插件上下文
   * @param interactionType - 交互类型
   */
  onInteraction?: (
    context: PluginContext<Config>,
    interactionType: InteractionType
  ) => void;

  /**
   * 加载中断时触发
   * @param context - 插件上下文
   */
  onAbort?: (context: PluginContext<Config>) => void;

  // ===== 渲染钩子 =====

  /**
   * 渲染钩子（在图片外层）
   * @param context - 插件上下文
   * @returns React 节点
   */
  render?: (context: PluginContext<Config>) => React.ReactNode;

  /**
   * 渲染叠加层（在图片上层）
   * @param context - 插件上下文
   * @returns React 节点
   */
  renderOverlay?: (context: PluginContext<Config>) => React.ReactNode;

  // ===== 其他钩子 =====

  /**
   * 转换 props（在渲染前）
   * @param props - 原始 props
   * @returns 转换后的 props
   */
  transformProps?: (props: LazyLoadImageCoreProps) => LazyLoadImageCoreProps;

  /**
   * 图片解码完成时触发
   * @param context - 插件上下文
   */
  onDecode?: (context: PluginContext<Config>) => void;

  /**
   * 图片绘制到页面时触发
   * @param context - 插件上下文
   */
  onPaint?: (context: PluginContext<Config>) => void;
}

/**
 * 插件接口（Issue #20: 添加配置类型约束）
 * @template Config - 插件配置类型
 */
export interface LazyImagePlugin<Config = any> {
  name: string;
  version?: string;

  /**
   * 插件钩子（Issue #21: 严格化参数类型）
   */
  hooks: PluginHooks<Config>;

  /**
   * 插件配置（Issue #20: 类型安全的配置）
   */
  config?: Config;

  // Issue #7: 插件优先级（数字越小越优先，默认 100）
  // 建议范围：0-10 (最高), 10-50 (高), 50-100 (中), 100-200 (低)
  priority?: number;

  // Issue #11: 渲染依赖声明（用于优化渲染性能）
  // 返回一个依赖数组，只有当这些依赖变化时才重新渲染该插件
  // 如果不提供，则默认依赖整个 context
  renderDeps?: (context: PluginContext<Config>) => any[];

  // Issue #17: 依赖管理
  dependencies?: string[];           // 必需依赖（插件名称列表）
  optionalDependencies?: string[];   // 可选依赖（插件名称列表）
  conflicts?: string[];              // 冲突插件（插件名称列表）

  // Issue #22: 版本兼容性
  minCoreVersion?: string;           // 最低核心版本要求
  maxCoreVersion?: string;           // 最高核心版本要求

  // Hook 工厂（用于按需初始化底层功能实例）
  hookFactory?: {
    create: (config: Config) => any;
    inject: (plugin: LazyImagePlugin<Config>, hookInstance: any) => void;
  };

  init?: () => void | Promise<void>;
  destroy?: () => void | Promise<void>;
}

// Issue #6: 插件冲突策略
export type PluginConflictStrategy =
  | "error"    // 抛出错误，阻止注册
  | "warn"     // 警告并替换（默认）
  | "ignore"   // 忽略新插件，保留旧插件
  | "override" // 静默替换，无警告
  ;

// Issue #6: 插件管理器配置
export interface PluginManagerConfig {
  conflictStrategy?: PluginConflictStrategy;
  enableDebug?: boolean;
}

/**
 * Issue #28: 热更新选项
 */
export interface HotReloadOptions {
  /** 是否保留旧插件的状态 */
  preserveState?: boolean;
  /** 状态迁移函数（当插件版本不同时） */
  migrateState?: (oldState: any, oldVersion?: string, newVersion?: string) => any;
  /** 是否强制替换（即使版本兼容性检查失败） */
  force?: boolean;
}

// ============ Issue #18: 高级类型工具 ============

/**
 * 提取钩子参数类型（Issue #18: 增强 PluginManager 类型安全）
 * @template H - 钩子名称类型
 */
export type HookArgs<H extends keyof PluginHooks> =
  PluginHooks[H] extends (context: any, ...args: infer A) => any
    ? A
    : PluginHooks[H] extends (context: any) => any
    ? []
    : never;

/**
 * 提取钩子返回值类型（Issue #18: 增强 PluginManager 类型安全）
 * @template H - 钩子名称类型
 */
export type HookResult<H extends keyof PluginHooks> =
  PluginHooks[H] extends (...args: any[]) => infer R
    ? R
    : never;

/**
 * 插件管理器接口（Issue #18: 类型安全增强）
 */
/**
 * Issue #28: 插件状态（用于热更新）
 */
export interface PluginState {
  /** 状态数据 */
  data: any;
  /** 状态版本 */
  version?: string;
  /** 保存时间戳 */
  timestamp: number;
}

export interface PluginManager {
  /**
   * 注册插件
   * @param plugin - 插件实例
   * @returns 是否注册成功（false 表示插件已存在或被忽略）
   */
  register: (plugin: LazyImagePlugin<any>) => boolean;

  /**
   * 注销插件
   * @param pluginName - 插件名称
   * @returns 是否卸载成功（false 表示插件不存在）
   */
  unregister: (pluginName: string) => boolean;

  /**
   * 获取插件
   * @param pluginName - 插件名称
   * @returns 插件实例或 undefined
   */
  getPlugin: (pluginName: string) => LazyImagePlugin<any> | undefined;

  /**
   * 获取所有插件
   * @returns 插件列表
   */
  getAllPlugins: () => LazyImagePlugin<any>[];

  /**
   * Issue #28: 保存插件状态（用于热更新）
   * @param pluginName - 插件名称
   * @param state - 状态数据
   */
  savePluginState: (pluginName: string, state: any) => void;

  /**
   * Issue #28: 获取插件状态（用于热更新）
   * @param pluginName - 插件名称
   * @returns 状态对象或 undefined
   */
  getPluginState: (pluginName: string) => PluginState | undefined;

  /**
   * Issue #28: 热替换插件
   * @param oldPluginName - 旧插件名称
   * @param newPlugin - 新插件实例
   * @param options - 热更新选项
   */
  hotReload: (
    oldPluginName: string,
    newPlugin: LazyImagePlugin<any>,
    options?: HotReloadOptions
  ) => void;

  /**
   * 执行钩子（Issue #18: 类型安全的钩子执行）
   * @template H - 钩子名称类型
   * @param hookName - 钩子名称
   * @param context - 插件上下文
   * @param args - 钩子参数
   * @returns 钩子结果
   *
   * @remarks
   * HookArgs 和 HookResult 类型工具可用于类型推导，
   * 但由于 TypeScript 限制，executeHook 使用宽松的 any[] 签名
   */
  executeHook: <H extends keyof PluginHooks>(
    hookName: H,
    context: PluginContext<any>,
    ...args: any[]
  ) => Promise<any>;

  /**
   * 获取配置（Issue #6）
   * @returns 当前配置
   */
  getConfig: () => PluginManagerConfig;

  /**
   * 更新配置（Issue #6）
   * @param config - 配置更新
   */
  setConfig: (config: Partial<PluginManagerConfig>) => void;
}