/**
 * LazyLoadImagePlugin 系统入口（完整包）
 *
 * Issue #30: 优化导出结构，避免循环依赖
 * 方案 B: 代码拆分，支持按需引入
 *
 * 这是完整包入口，包含所有功能。
 * 如需更小的体积，请使用子模块：
 * - vane-lazy-image/core      (~8-10KB)
 * - vane-lazy-image/plugins   (~3-4KB)
 * - vane-lazy-image/advanced  (~4-5KB)
 * - vane-lazy-image/monitoring (~2-3KB)
 *
 * Bundle Size: ~22KB (gzip) 完整包
 *
 * - 按功能分组导出
 * - 使用显式命名导出（tree-shaking 友好）
 * - 避免 re-export 导致的重复导出
 */

// ============================================================================
// 核心版本
// ============================================================================

// Issue #22: 核心版本导出
export const LAZY_IMAGE_CORE_VERSION = "1.0.0";

// ============================================================================
// 常量系统 (Issue #31)
// ============================================================================

export * from "./constants";

// ============================================================================
// 核心组件
// ============================================================================

export { default as LazyLoadImageCore } from "./core/LazyLoadImageCore";
export type {
  LazyLoadImageCoreProps,
  LazyLoadImageCoreRef,
  ImageState,
} from "./core/LazyLoadImageCore";

// 🚀 性能优化工具：ObserverPool（共享 IntersectionObserver 实例）
export {
  observeElement,
  unobserveElement,
  getObserverPoolStats,
  setObserverPoolDebugMode,
  getObserverPoolDetails,
  cleanupObserverPool,
  resetObserverPoolStats,
  observerPool,
} from "./core/ObserverPool";
export type { ObserverConfig, PoolStats } from "./core/ObserverPool";

// 🚀 性能优化工具：GlobalContext（全局单例上下文）
export {
  getGlobalNetworkInfo,
  getGlobalDeviceInfo,
  getGlobalContextStats,
  addGlobalContextListener,
  globalContext,
} from "./utils/GlobalContext";

// ============================================================================
// Hooks (性能优化)
// ============================================================================

export { useLCPPreload, useImagePreload } from "./hooks/useLCPPreload";
export type { LCPPreloadOptions } from "./hooks/useLCPPreload";

// ============================================================================
// 插件系统核心
// ============================================================================

export {
  withPlugins,
  createFetchLoaderPlugin,
  createPluginBus,
  createTypedPluginBus, // Issue #19: 类型安全的事件总线
  createPluginManager,
  // Issue #29: 沙箱机制
  createPluginSandbox,
  wrapPluginHook,
  cleanupSandbox,
  cleanupSandboxes,
} from "./plugins";

export type {
  LazyImagePlugin,
  PluginContext,
  PluginHooks,
  PluginManager,
  ProgressInfo,
  NetworkInfo,
  DeviceInfo,
  Dimensions,
  // Issue #19: 类型安全的事件系统
  PluginBusEvents,
  TypedPluginBus,
  PluginBus,
  // Issue #18: 高级类型工具
  HookArgs,
  HookResult,
  // Issue #20: 类型安全的插件配置
  FetchLoaderPluginConfig,
  // Issue #25: PluginBus 调试支持
  PluginBusConfig,
  ListenerInfo,
  // Issue #28: 热更新支持
  PluginState,
  HotReloadOptions,
  // Issue #29: 沙箱机制
  SandboxConfig,
  SandboxedContext,
} from "./plugins";

// ============================================================================
// 工具模块
// ============================================================================

// Issue #23: 性能监控
export {
  createPerformanceMonitor,
  getGlobalMonitorManager,
  resetGlobalMonitorManager,
} from "./utils/PerformanceMonitor";

export type {
  PerformanceMonitor,
  PerformanceReport,
  PerformanceMetrics,
  PerformanceMonitorConfig,
} from "./utils/PerformanceMonitor";

// ============================================================================
// 自定义插件 (Issue #30: 单一入口导出，避免重复)
// ============================================================================

export * from "./custom-plugins";
