// LazyLoadImagePlugin 系统入口显式导出（tree-shaking 友好）
export { default as LazyLoadImageCore } from "./core/LazyLoadImageCore";
export type { LazyLoadImageCoreProps, LazyLoadImageCoreRef, ImageState } from "./core/LazyLoadImageCore";

// 插件系统与自定义插件
export {
  withPlugins,
  createFetchLoaderPlugin,
  createPluginBus,
  createPluginManager,
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
} from "./plugins";

// 提供 custom-plugins 的命名导出（保持以索引按需引入的体验）
export * from "./custom-plugins";