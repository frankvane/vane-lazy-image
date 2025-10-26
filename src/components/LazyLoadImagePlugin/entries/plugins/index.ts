/**
 * @module vane-lazy-image/plugins
 * 插件系统扩展包
 *
 * Bundle Size: ~3-4KB (gzip)
 *
 * 包含：
 * - withPlugins HOC
 * - createFetchLoaderPlugin
 * - createPluginBus/createPluginManager
 * - 插件系统核心类型
 * - 自定义插件
 */

// ============================================================================
// 插件系统核心
// ============================================================================
export {
  withPlugins,
  createFetchLoaderPlugin,
  createPluginBus,
  createTypedPluginBus,
  createPluginManager,
} from "../../plugins";

export type {
  LazyImagePlugin,
  PluginContext,
  PluginHooks,
  PluginManager,
  ProgressInfo,
  NetworkInfo,
  DeviceInfo,
  Dimensions,
  PluginBusEvents,
  TypedPluginBus,
  PluginBus,
  HookArgs,
  HookResult,
  FetchLoaderPluginConfig,
  PluginBusConfig,
  ListenerInfo,
} from "../../plugins";

// ============================================================================
// 自定义插件
// ============================================================================
// 注意：自定义插件已拆分为独立模块，按需引入：
// - vane-lazy-image/watermark
// - vane-lazy-image/caption
// 如需全部引入，请使用完整包：
// - vane-lazy-image (包含所有插件)

