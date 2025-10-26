// 插件系统显式命名导出（tree-shaking 友好）
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
  // Issue #25: PluginBus 调试支持
  PluginBusConfig,
  ListenerInfo,
  // Issue #28: 热更新支持
  PluginState,
  HotReloadOptions,
} from "./types";
export { createPluginBus, createTypedPluginBus } from "./PluginBus";
export { createPluginManager } from "./PluginManager";
export { withPlugins } from "./withPlugins";
export { createFetchLoaderPlugin } from "./FetchLoaderPlugin";
export type { FetchLoaderPluginConfig } from "./FetchLoaderPlugin";

// Issue #29: 沙箱机制
export {
  createPluginSandbox,
  wrapPluginHook,
  cleanupSandbox,
  cleanupSandboxes,
} from "./PluginSandbox";
export type { SandboxConfig, SandboxedContext } from "./PluginSandbox";

// Issue #30: 移除 custom-plugins 的导出，避免重复导出和潜在的循环依赖
// 自定义插件应该从主入口统一导出