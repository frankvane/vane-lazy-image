import "./App.css";

import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import React, { Suspense, lazy } from "react";

// 🚀 懒加载所有页面组件，减少初始包体积
const Home = lazy(() => import("./pages/LazyLoadImagePlugin/Home"));
const ReadmeDemo = lazy(() => import("./pages/LazyLoadImagePlugin/ReadmeDemo"));

// 视觉与效果
const WatermarkDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/WatermarkDemo")
);
const BorderGlowDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/BorderGlowDemo")
);
const CaptionDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/CaptionDemo")
);
const FilterDemo = lazy(() => import("./pages/LazyLoadImagePlugin/FilterDemo"));
const GalleryDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/GalleryDemo")
);
const OverlayInfoDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/OverlayInfoDemo")
);
const ProgressOverlayDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ProgressOverlayDemo")
);
const SkeletonDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/SkeletonDemo")
);
const BlurUpDemo = lazy(() => import("./pages/LazyLoadImagePlugin/BlurUpDemo"));
const FadeInDemo = lazy(() => import("./pages/LazyLoadImagePlugin/FadeInDemo"));
const CustomEffectsDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/CustomEffectsDemo")
);
const TransitionDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/TransitionDemo")
);
const ParallaxDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ParallaxDemo")
);
const ColorExtractionDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ColorExtractionDemo")
);
const RedactionDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/RedactionDemo")
);
const HoverZoomDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/HoverZoomDemo")
);

// 性能与网络
const PreconnectDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/PreconnectDemo")
);
const PriorityLoadingDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/PriorityLoadingDemo")
);
const CachePrewarmDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/CachePrewarmDemo")
);
const MemoryCacheDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/MemoryCacheDemo")
);
const IDBCacheDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/IDBCacheDemo")
);
const ConcurrencyDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ConcurrencyDemo")
);
const ScrollIdleDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ScrollIdleDemo")
);
const NetworkAnalyticsDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/NetworkAnalyticsDemo")
);
const PredictiveLoadingDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/PredictiveLoadingDemo")
);
const DataSaverDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/DataSaverDemo")
);
const ImageOptimizationDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ImageOptimizationDemo")
);
const FetchLoaderDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/FetchLoaderDemo")
);
const GlobalContextDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/GlobalContextDemo")
);
const ObserverPoolDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ObserverPoolDemo")
);
const PerformanceOptimizationDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/PerformanceOptimizationDemo")
);

// 稳健性与错误处理
const ErrorBadgeDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ErrorBadgeDemo")
);
const ErrorOverlayDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ErrorOverlayDemo")
);
const FallbackImageDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/FallbackImageDemo")
);
const RetryOnErrorDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/RetryOnErrorDemo")
);
const ErrorTrackingDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ErrorTrackingDemo")
);
const OfflineDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/OfflineDemo")
);
const MemoryPressureAbortDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/MemoryPressureAbortDemo")
);
const DecodeAfterIdleDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/DecodeAfterIdleDemo")
);
const AntiHotlinkDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/AntiHotlinkDemo")
);
const CDNFallbackDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/CDNFallbackDemo")
);
const AuthDemo = lazy(() => import("./pages/LazyLoadImagePlugin/AuthDemo"));

// 视口与交互
const ViewportAwareDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ViewportAwareDemo")
);
const ViewportDebounceDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ViewportDebounceDemo")
);
const HoverPrefetchDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/HoverPrefetchDemo")
);
const VirtualVerticalListDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/VirtualVerticalListDemo")
);
const VirtualHorizontalListDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/VirtualHorizontalListDemo")
);
const VirtualGridDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/VirtualGridDemo")
);
const UserBehaviorDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/UserBehaviorDemo")
);
const ViewportDwellDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ViewportDwellDemo")
);

// 可访问性与 SEO
const A11yDemo = lazy(() => import("./pages/LazyLoadImagePlugin/A11yDemo"));
const AltTextDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/AltTextDemo")
);
const ExifOrientationDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ExifOrientationDemo")
);
const AspectRatioSpacerDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/AspectRatioSpacerDemo")
);
const ResponsiveDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ResponsiveDemo")
);
const SEODemo = lazy(() => import("./pages/LazyLoadImagePlugin/SEODemo"));

// 其他
const BadgeDemo = lazy(() => import("./pages/LazyLoadImagePlugin/BadgeDemo"));
const DominantColorDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/DominantColorDemo")
);
const EventLoggerDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/EventLoggerDemo")
);
const LqipDemo = lazy(() => import("./pages/LazyLoadImagePlugin/LqipDemo"));
const PerformanceMonitorDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/PerformanceMonitorDemo")
);
const AdaptiveQualityDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/AdaptiveQualityDemo")
);
const BatteryAwareDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/BatteryAwareDemo")
);
const CropDemo = lazy(() => import("./pages/LazyLoadImagePlugin/CropDemo"));
const ComparisonDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ComparisonDemo")
);
const SvgPlaceholderDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/SvgPlaceholderDemo")
);
const WebPDemo = lazy(() => import("./pages/LazyLoadImagePlugin/WebPDemo"));

// 高级功能 (Advanced)
const PluginSandboxDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/PluginSandboxDemo")
);
const PerformanceMonitoringDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/PerformanceMonitoringDemo")
);
const PluginHotReloadDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/PluginHotReloadDemo")
);
const DependencyResolverDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/DependencyResolverDemo")
);

// 组合示例
const ComboErrorResilienceDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ComboErrorResilienceDemo")
);
const ComboPerformanceDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ComboPerformanceDemo")
);
const ComboVisualEffectsDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ComboVisualEffectsDemo")
);
const ComboCacheDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ComboCacheDemo")
);
const ComboViewportInteractionDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ComboViewportInteractionDemo")
);
const ComboA11ySeoDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ComboA11ySeoDemo")
);
const ComboVisualEffectsPlusDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ComboVisualEffectsPlusDemo")
);
const ComboResponsiveSeoWebPDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ComboResponsiveSeoWebPDemo")
);
const ComboInteractionOverlayDemo = lazy(
  () => import("./pages/LazyLoadImagePlugin/ComboInteractionOverlayDemo")
);

// 🎨 加载指示器组件
const LoadingFallback: React.FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "400px",
      fontSize: "18px",
      color: "#666",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #3498db",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 16px",
        }}
      />
      <div>加载中...</div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Vane LazyLoadImage 演示</h2>
        <nav className="nav">
          <NavLink to="/" end>
            首页
          </NavLink>
          <NavLink to="/readme">📖 README 文档</NavLink>

          <h3 style={{ marginTop: 12 }}>组合示例</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <NavLink to="/lli-plugin/combo/error-resilience">
              错误韧性组合
            </NavLink>
            <NavLink to="/lli-plugin/combo/performance">性能与网络组合</NavLink>
            <NavLink to="/lli-plugin/combo/visual-effects">
              视觉与效果组合
            </NavLink>
            <NavLink to="/lli-plugin/combo/cache-storage">
              缓存与存储组合
            </NavLink>
            <NavLink to="/lli-plugin/combo/viewport-interaction">
              视口与交互组合
            </NavLink>
            <NavLink to="/lli-plugin/combo/a11y-seo">
              可访问性与 SEO 组合
            </NavLink>
            <NavLink to="/lli-plugin/combo/visual-effects-plus">
              视觉增强 Plus
            </NavLink>
            <NavLink to="/lli-plugin/combo/responsive-seo-webp">
              响应式 + SEO + WebP
            </NavLink>
            <NavLink to="/lli-plugin/combo/interaction-overlay">
              交互与叠层组合
            </NavLink>
          </div>

          <h3 style={{ marginTop: 12 }}>视觉与效果</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <NavLink to="/lli-plugin/watermark">Watermark</NavLink>
            <NavLink to="/lli-plugin/border-glow">BorderGlow</NavLink>
            <NavLink to="/lli-plugin/caption">Caption</NavLink>
            <NavLink to="/lli-plugin/filter">Filter</NavLink>
            <NavLink to="/lli-plugin/gallery">Gallery</NavLink>
            <NavLink to="/lli-plugin/overlay-info">OverlayInfo</NavLink>
            <NavLink to="/lli-plugin/progress-overlay">ProgressOverlay</NavLink>
            <NavLink to="/lli-plugin/skeleton">Skeleton</NavLink>
            <NavLink to="/lli-plugin/blur-up">BlurUp</NavLink>
            <NavLink to="/lli-plugin/fade-in">FadeIn</NavLink>
            <NavLink to="/lli-plugin/custom-effects">Custom-Effects</NavLink>
            <NavLink to="/lli-plugin/transition">Transition</NavLink>
            <NavLink to="/lli-plugin/parallax">Parallax</NavLink>
            <NavLink to="/lli-plugin/color-extraction">ColorExtraction</NavLink>
            <NavLink to="/lli-plugin/redaction">Redaction</NavLink>
            <NavLink to="/lli-plugin/hover-zoom">HoverZoom</NavLink>
          </div>

          <h3 style={{ marginTop: 12 }}>性能与网络</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <NavLink to="/lli-plugin/preconnect">Preconnect</NavLink>
            <NavLink to="/lli-plugin/priority-loading">PriorityLoading</NavLink>
            <NavLink to="/lli-plugin/cache-prewarm">CachePrewarm</NavLink>
            <NavLink to="/lli-plugin/memory-cache">MemoryCache</NavLink>
            <NavLink to="/lli-plugin/idb-cache">IDBCache</NavLink>
            <NavLink to="/lli-plugin/concurrency">Concurrency</NavLink>
            <NavLink to="/lli-plugin/scroll-idle">ScrollIdle</NavLink>
            <NavLink to="/lli-plugin/network-analytics">
              NetworkAnalytics
            </NavLink>
            <NavLink to="/lli-plugin/predictive-loading">
              PredictiveLoading
            </NavLink>
            <NavLink to="/lli-plugin/data-saver">DataSaver</NavLink>
            <NavLink to="/lli-plugin/image-optimization">
              ImageOptimization
            </NavLink>
            <NavLink to="/lli-plugin/fetch-loader">FetchLoader</NavLink>
            <NavLink to="/lli-plugin/global-context" style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontWeight: "bold"
            }}>
              🚀 GlobalContext
            </NavLink>
            <NavLink to="/lli-plugin/observer-pool" style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontWeight: "bold"
            }}>
              👁️ ObserverPool
            </NavLink>
            <NavLink to="/lli-plugin/performance-optimization" style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontWeight: "bold"
            }}>
              ⚡ 性能优化综合
            </NavLink>
          </div>

          <h3 style={{ marginTop: 12 }}>稳健性与错误处理</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <NavLink to="/lli-plugin/error-badge">ErrorBadge</NavLink>
            <NavLink to="/lli-plugin/error-overlay">ErrorOverlay</NavLink>
            <NavLink to="/lli-plugin/fallback-image">FallbackImage</NavLink>
            <NavLink to="/lli-plugin/retry-on-error">RetryOnError</NavLink>
            <NavLink to="/lli-plugin/error-tracking">ErrorTracking</NavLink>
            <NavLink to="/lli-plugin/offline">Offline</NavLink>
            <NavLink to="/lli-plugin/memory-abort">MemoryAbort</NavLink>
            <NavLink to="/lli-plugin/decode-idle">DecodeIdle</NavLink>
            <NavLink to="/lli-plugin/anti-hotlink">AntiHotlink</NavLink>
            <NavLink to="/lli-plugin/cdn-fallback">CDNFallback</NavLink>
            <NavLink to="/lli-plugin/auth">Auth</NavLink>
          </div>

          <h3 style={{ marginTop: 12 }}>视口与交互</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <NavLink to="/lli-plugin/viewport-aware">ViewportAware</NavLink>
            <NavLink to="/lli-plugin/viewport-debounce">
              ViewportDebounce
            </NavLink>
            <NavLink to="/lli-plugin/hover-prefetch">HoverPrefetch</NavLink>
            <NavLink to="/lli-plugin/virtual-vertical">
              Virtual-Vertical
            </NavLink>
            <NavLink to="/lli-plugin/virtual-horizontal">
              Virtual-Horizontal
            </NavLink>
            <NavLink to="/lli-plugin/virtual-grid">Virtual-Grid</NavLink>
            <NavLink to="/lli-plugin/user-behavior">UserBehavior</NavLink>
            <NavLink to="/lli-plugin/viewport-dwell">ViewportDwell</NavLink>
          </div>

          <h3 style={{ marginTop: 12 }}>可访问性与 SEO</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <NavLink to="/lli-plugin/a11y">A11y</NavLink>
            <NavLink to="/lli-plugin/alt-text">AltText</NavLink>
            <NavLink to="/lli-plugin/exif-orientation">ExifOrientation</NavLink>
            <NavLink to="/lli-plugin/aspect-ratio-spacer">
              AspectRatioSpacer
            </NavLink>
            <NavLink to="/lli-plugin/responsive">Responsive</NavLink>
            <NavLink to="/lli-plugin/seo">SEO</NavLink>
          </div>

          <h3 style={{ marginTop: 12 }}>其他</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <NavLink to="/lli-plugin/badge">Badge</NavLink>
            <NavLink to="/lli-plugin/dominant-color">DominantColor</NavLink>
            <NavLink to="/lli-plugin/event-logger">EventLogger</NavLink>
            <NavLink to="/lli-plugin/lqip">LQIP</NavLink>
            <NavLink to="/lli-plugin/svg-placeholder">SvgPlaceholder</NavLink>
            <NavLink to="/lli-plugin/performance-monitor">
              PerformanceMonitor
            </NavLink>
            <NavLink to="/lli-plugin/adaptive-quality">AdaptiveQuality</NavLink>
            <NavLink to="/lli-plugin/battery-aware">BatteryAware</NavLink>
            <NavLink to="/lli-plugin/crop">Crop</NavLink>
            <NavLink to="/lli-plugin/comparison">Comparison</NavLink>
            <NavLink to="/lli-plugin/webp">WebP</NavLink>
          </div>

          <h3 style={{ marginTop: 12 }}>🚀 高级功能</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <NavLink to="/lli-plugin/plugin-sandbox" style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontWeight: "bold"
            }}>
              🛡️ PluginSandbox
            </NavLink>
            <NavLink to="/lli-plugin/performance-monitoring" style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontWeight: "bold"
            }}>
              📊 性能监控系统
            </NavLink>
            <NavLink to="/lli-plugin/plugin-hot-reload" style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontWeight: "bold"
            }}>
              🔥 插件热更新
            </NavLink>
            <NavLink to="/lli-plugin/dependency-resolver" style={{
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontWeight: "bold"
            }}>
              🧩 依赖解析器
            </NavLink>
          </div>
        </nav>
      </aside>
      <main className="main">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/readme" element={<ReadmeDemo />} />
            <Route path="/lli-plugin/watermark" element={<WatermarkDemo />} />
            <Route path="/lli-plugin/a11y" element={<A11yDemo />} />
            <Route
              path="/lli-plugin/border-glow"
              element={<BorderGlowDemo />}
            />
            <Route path="/lli-plugin/caption" element={<CaptionDemo />} />
            <Route path="/lli-plugin/filter" element={<FilterDemo />} />
            <Route path="/lli-plugin/gallery" element={<GalleryDemo />} />
            <Route path="/lli-plugin/alt-text" element={<AltTextDemo />} />
            <Route
              path="/lli-plugin/aspect-ratio-spacer"
              element={<AspectRatioSpacerDemo />}
            />
            <Route path="/lli-plugin/badge" element={<BadgeDemo />} />
            <Route path="/lli-plugin/blur-up" element={<BlurUpDemo />} />
            <Route
              path="/lli-plugin/cache-prewarm"
              element={<CachePrewarmDemo />}
            />
            <Route
              path="/lli-plugin/dominant-color"
              element={<DominantColorDemo />}
            />
            <Route
              path="/lli-plugin/error-badge"
              element={<ErrorBadgeDemo />}
            />
            <Route
              path="/lli-plugin/error-overlay"
              element={<ErrorOverlayDemo />}
            />
            <Route
              path="/lli-plugin/event-logger"
              element={<EventLoggerDemo />}
            />
            <Route path="/lli-plugin/fade-in" element={<FadeInDemo />} />
            <Route
              path="/lli-plugin/fallback-image"
              element={<FallbackImageDemo />}
            />
            <Route
              path="/lli-plugin/fetch-loader"
              element={<FetchLoaderDemo />}
            />
            <Route
              path="/lli-plugin/global-context"
              element={<GlobalContextDemo />}
            />
            <Route
              path="/lli-plugin/observer-pool"
              element={<ObserverPoolDemo />}
            />
            <Route
              path="/lli-plugin/performance-optimization"
              element={<PerformanceOptimizationDemo />}
            />
            <Route path="/lli-plugin/idb-cache" element={<IDBCacheDemo />} />
            <Route path="/lli-plugin/lqip" element={<LqipDemo />} />
            <Route
              path="/lli-plugin/memory-cache"
              element={<MemoryCacheDemo />}
            />
            <Route
              path="/lli-plugin/overlay-info"
              element={<OverlayInfoDemo />}
            />
            <Route path="/lli-plugin/preconnect" element={<PreconnectDemo />} />
            <Route
              path="/lli-plugin/priority-loading"
              element={<PriorityLoadingDemo />}
            />
            <Route
              path="/lli-plugin/progress-overlay"
              element={<ProgressOverlayDemo />}
            />
            <Route
              path="/lli-plugin/retry-on-error"
              element={<RetryOnErrorDemo />}
            />
            <Route path="/lli-plugin/skeleton" element={<SkeletonDemo />} />
            <Route
              path="/lli-plugin/concurrency"
              element={<ConcurrencyDemo />}
            />
            <Route
              path="/lli-plugin/scroll-idle"
              element={<ScrollIdleDemo />}
            />
            <Route
              path="/lli-plugin/virtual-vertical"
              element={<VirtualVerticalListDemo />}
            />
            <Route
              path="/lli-plugin/virtual-horizontal"
              element={<VirtualHorizontalListDemo />}
            />
            <Route
              path="/lli-plugin/virtual-grid"
              element={<VirtualGridDemo />}
            />
            <Route
              path="/lli-plugin/custom-effects"
              element={<CustomEffectsDemo />}
            />
            <Route
              path="/lli-plugin/performance-monitor"
              element={<PerformanceMonitorDemo />}
            />
            <Route
              path="/lli-plugin/error-tracking"
              element={<ErrorTrackingDemo />}
            />
            <Route path="/lli-plugin/auth" element={<AuthDemo />} />
            <Route
              path="/lli-plugin/adaptive-quality"
              element={<AdaptiveQualityDemo />}
            />
            <Route
              path="/lli-plugin/cdn-fallback"
              element={<CDNFallbackDemo />}
            />
            <Route
              path="/lli-plugin/viewport-aware"
              element={<ViewportAwareDemo />}
            />
            <Route path="/lli-plugin/transition" element={<TransitionDemo />} />
            <Route
              path="/lli-plugin/predictive-loading"
              element={<PredictiveLoadingDemo />}
            />
            <Route path="/lli-plugin/data-saver" element={<DataSaverDemo />} />
            <Route
              path="/lli-plugin/image-optimization"
              element={<ImageOptimizationDemo />}
            />
            <Route
              path="/lli-plugin/anti-hotlink"
              element={<AntiHotlinkDemo />}
            />
            <Route
              path="/lli-plugin/network-analytics"
              element={<NetworkAnalyticsDemo />}
            />
            <Route
              path="/lli-plugin/viewport-debounce"
              element={<ViewportDebounceDemo />}
            />
            <Route
              path="/lli-plugin/user-behavior"
              element={<UserBehaviorDemo />}
            />
            <Route path="/lli-plugin/parallax" element={<ParallaxDemo />} />
            <Route
              path="/lli-plugin/color-extraction"
              element={<ColorExtractionDemo />}
            />
            <Route path="/lli-plugin/offline" element={<OfflineDemo />} />
            <Route path="/lli-plugin/crop" element={<CropDemo />} />
            <Route path="/lli-plugin/comparison" element={<ComparisonDemo />} />
            <Route
              path="/lli-plugin/hover-prefetch"
              element={<HoverPrefetchDemo />}
            />
            <Route
              path="/lli-plugin/memory-abort"
              element={<MemoryPressureAbortDemo />}
            />
            <Route
              path="/lli-plugin/decode-idle"
              element={<DecodeAfterIdleDemo />}
            />
            <Route
              path="/lli-plugin/battery-aware"
              element={<BatteryAwareDemo />}
            />
            <Route
              path="/lli-plugin/exif-orientation"
              element={<ExifOrientationDemo />}
            />
            <Route path="/lli-plugin/redaction" element={<RedactionDemo />} />
            <Route path="/lli-plugin/hover-zoom" element={<HoverZoomDemo />} />
            <Route path="/lli-plugin/responsive" element={<ResponsiveDemo />} />
            <Route path="/lli-plugin/seo" element={<SEODemo />} />
            <Route
              path="/lli-plugin/svg-placeholder"
              element={<SvgPlaceholderDemo />}
            />
            <Route
              path="/lli-plugin/viewport-dwell"
              element={<ViewportDwellDemo />}
            />
            <Route path="/lli-plugin/webp" element={<WebPDemo />} />
            {/* 高级功能路由 */}
            <Route
              path="/lli-plugin/plugin-sandbox"
              element={<PluginSandboxDemo />}
            />
            <Route
              path="/lli-plugin/performance-monitoring"
              element={<PerformanceMonitoringDemo />}
            />
            <Route
              path="/lli-plugin/plugin-hot-reload"
              element={<PluginHotReloadDemo />}
            />
            <Route
              path="/lli-plugin/dependency-resolver"
              element={<DependencyResolverDemo />}
            />
            {/* 组合示例路由 */}
            <Route
              path="/lli-plugin/combo/error-resilience"
              element={<ComboErrorResilienceDemo />}
            />
            <Route
              path="/lli-plugin/combo/performance"
              element={<ComboPerformanceDemo />}
            />
            <Route
              path="/lli-plugin/combo/visual-effects"
              element={<ComboVisualEffectsDemo />}
            />
            <Route
              path="/lli-plugin/combo/cache-storage"
              element={<ComboCacheDemo />}
            />
            <Route
              path="/lli-plugin/combo/viewport-interaction"
              element={<ComboViewportInteractionDemo />}
            />
            <Route
              path="/lli-plugin/combo/a11y-seo"
              element={<ComboA11ySeoDemo />}
            />
            <Route
              path="/lli-plugin/combo/visual-effects-plus"
              element={<ComboVisualEffectsPlusDemo />}
            />
            <Route
              path="/lli-plugin/combo/responsive-seo-webp"
              element={<ComboResponsiveSeoWebPDemo />}
            />
            <Route
              path="/lli-plugin/combo/interaction-overlay"
              element={<ComboInteractionOverlayDemo />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default App;
