# 自定义插件清单（Custom Plugins Catalog）

以下清单与 `custom-plugins/index.ts` 的桶式导出保持同步，用于快速了解当前可用的插件。

## 视觉与效果
- WatermarkPlugin
- BadgePlugin
- ProgressOverlayPlugin
- SkeletonPlugin
- OverlayInfoPlugin
- BlurUpPlugin
- FadeInPlugin
- DominantColorPlugin
- AspectRatioSpacerPlugin
- BorderGlowPlugin
- SvgPlaceholderPlugin
- GalleryPlugin
- HoverZoomPlugin
- CaptionPlugin
- FilterPlugin

## 性能与网络
- PreconnectPlugin
- PriorityLoadingPlugin
- CacheMemoryPlugin
- CacheIDBPlugin
- CachePrewarmPlugin
- ConcurrencyControlPlugin
- ScrollIdlePlugin
- ViewportDwellPlugin
- AdaptiveQualityPlugin
- CDNFallbackPlugin

## 稳健性与错误处理
- FallbackImagePlugin
- RetryOnErrorPlugin
- ErrorOverlayPlugin
- ErrorBadgePlugin

## 监控与可观测性
- EventLoggerPlugin
- PerformanceMonitorPlugin
- ErrorTrackingPlugin

## LQIP 与低清晰度
- LQIPPlugin

## 新增（格式、响应式、SEO、可访问性）
- WebPPlugin：在支持 WebP 的环境优先加载 `.webp`，失败回退原图
- ResponsivePlugin：在 `onLoadSuccess` 注入 `srcset/sizes` 响应式资源
- SEOPlugin：`alt` 回退、`title`、固定 `aspectRatio`、可选 `preload`、LCP 优先
- A11yPlugin：`aria-*` 与装饰性图片支持、状态文本无障碍覆盖层

## 视口与交互
- ViewportAwarePlugin：显示视口状态指示点并标记 DOM
- TransitionPlugin：加载成功后执行淡入与缩放过渡

## 鉴权与稳健性
- AuthPlugin：为图片 URL 追加鉴权参数并配置跨域策略

> 说明：如需使用，请从 `../../components/LazyLoadImagePlugin/plugins` 导入对应的 `createXXXPlugin` 工厂函数，并与 `withPlugins` 组合到 `LazyLoadImageCore`。