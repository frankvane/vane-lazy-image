/**
 * @module vane-lazy-image/advanced
 * 高级特性扩展包
 *
 * Bundle Size: ~4-5KB (gzip)
 *
 * 包含：
 * - 插件热更新系统
 * - 插件沙箱机制
 * - 依赖解析器
 * - 版本管理
 */

// ============================================================================
// 热更新系统 (Issue #28)
// ============================================================================
export type {
  PluginState,
  HotReloadOptions,
} from "../../plugins/types";

// 热更新 API 通过 PluginManager 提供
// 用户需要从 plugins 模块获取 PluginManager，然后使用其 hotReload 方法

// ============================================================================
// 沙箱机制 (Issue #29)
// ============================================================================
export {
  createPluginSandbox,
  wrapPluginHook,
  cleanupSandbox,
  cleanupSandboxes,
} from "../../plugins/PluginSandbox";

export type {
  SandboxConfig,
  SandboxedContext,
} from "../../plugins/PluginSandbox";

// ============================================================================
// 依赖管理和版本控制
// ============================================================================
export { DependencyResolver } from "../../utils/DependencyResolver";
export {
  compareVersions,
  isVersionInRange,
  parseVersion,
  isValidVersion,
  formatVersion,
  isVersionEqual,
  isVersionGreater,
  isVersionLess,
} from "../../utils/versionCompare";

