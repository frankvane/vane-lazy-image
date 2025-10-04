import "./App.css";

import { NavLink, Navigate, Route, Routes } from "react-router-dom";

import A11yDemo from "./pages/LazyLoadImagePlugin/A11yDemo";
import AdaptiveQualityDemo from "./pages/LazyLoadImagePlugin/AdaptiveQualityDemo";
import AltTextDemo from "./pages/LazyLoadImagePlugin/AltTextDemo";
import AntiHotlinkDemo from "./pages/LazyLoadImagePlugin/AntiHotlinkDemo";
import AspectRatioSpacerDemo from "./pages/LazyLoadImagePlugin/AspectRatioSpacerDemo";
import AuthDemo from "./pages/LazyLoadImagePlugin/AuthDemo";
import BadgeDemo from "./pages/LazyLoadImagePlugin/BadgeDemo";
import BatteryAwareDemo from "./pages/LazyLoadImagePlugin/BatteryAwareDemo";
import BlurUpDemo from "./pages/LazyLoadImagePlugin/BlurUpDemo";
import BorderGlowDemo from "./pages/LazyLoadImagePlugin/BorderGlowDemo";
import CDNFallbackDemo from "./pages/LazyLoadImagePlugin/CDNFallbackDemo";
import CachePrewarmDemo from "./pages/LazyLoadImagePlugin/CachePrewarmDemo";
import CaptionDemo from "./pages/LazyLoadImagePlugin/CaptionDemo";
import ColorExtractionDemo from "./pages/LazyLoadImagePlugin/ColorExtractionDemo";
import ComboA11ySeoDemo from "./pages/LazyLoadImagePlugin/ComboA11ySeoDemo";
import ComboCacheDemo from "./pages/LazyLoadImagePlugin/ComboCacheDemo";
import ComboErrorResilienceDemo from "./pages/LazyLoadImagePlugin/ComboErrorResilienceDemo";
import ComboInteractionOverlayDemo from "./pages/LazyLoadImagePlugin/ComboInteractionOverlayDemo";
import ComboPerformanceDemo from "./pages/LazyLoadImagePlugin/ComboPerformanceDemo";
import ComboResponsiveSeoWebPDemo from "./pages/LazyLoadImagePlugin/ComboResponsiveSeoWebPDemo";
import ComboViewportInteractionDemo from "./pages/LazyLoadImagePlugin/ComboViewportInteractionDemo";
import ComboVisualEffectsDemo from "./pages/LazyLoadImagePlugin/ComboVisualEffectsDemo";
import ComboVisualEffectsPlusDemo from "./pages/LazyLoadImagePlugin/ComboVisualEffectsPlusDemo";
import ComparisonDemo from "./pages/LazyLoadImagePlugin/ComparisonDemo";
import ConcurrencyDemo from "./pages/LazyLoadImagePlugin/ConcurrencyDemo";
import CropDemo from "./pages/LazyLoadImagePlugin/CropDemo";
import CustomEffectsDemo from "./pages/LazyLoadImagePlugin/CustomEffectsDemo";
import DataSaverDemo from "./pages/LazyLoadImagePlugin/DataSaverDemo";
import DecodeAfterIdleDemo from "./pages/LazyLoadImagePlugin/DecodeAfterIdleDemo";
import DemoPage from "./pages/LazyLoadImagePlugin/_layout/DemoPage";
import DominantColorDemo from "./pages/LazyLoadImagePlugin/DominantColorDemo";
import ErrorBadgeDemo from "./pages/LazyLoadImagePlugin/ErrorBadgeDemo";
import ErrorOverlayDemo from "./pages/LazyLoadImagePlugin/ErrorOverlayDemo";
import ErrorTrackingDemo from "./pages/LazyLoadImagePlugin/ErrorTrackingDemo";
import EventLoggerDemo from "./pages/LazyLoadImagePlugin/EventLoggerDemo";
import ExifOrientationDemo from "./pages/LazyLoadImagePlugin/ExifOrientationDemo";
import FadeInDemo from "./pages/LazyLoadImagePlugin/FadeInDemo";
import FallbackImageDemo from "./pages/LazyLoadImagePlugin/FallbackImageDemo";
import FetchLoaderDemo from "./pages/LazyLoadImagePlugin/FetchLoaderDemo";
import FilterDemo from "./pages/LazyLoadImagePlugin/FilterDemo";
import GalleryDemo from "./pages/LazyLoadImagePlugin/GalleryDemo";
import Home from "./pages/LazyLoadImagePlugin/Home";
import HoverPrefetchDemo from "./pages/LazyLoadImagePlugin/HoverPrefetchDemo";
import IDBCacheDemo from "./pages/LazyLoadImagePlugin/IDBCacheDemo";
import ImageOptimizationDemo from "./pages/LazyLoadImagePlugin/ImageOptimizationDemo";
import LqipDemo from "./pages/LazyLoadImagePlugin/LqipDemo";
import MemoryCacheDemo from "./pages/LazyLoadImagePlugin/MemoryCacheDemo";
import MemoryPressureAbortDemo from "./pages/LazyLoadImagePlugin/MemoryPressureAbortDemo";
import NetworkAnalyticsDemo from "./pages/LazyLoadImagePlugin/NetworkAnalyticsDemo";
import OfflineDemo from "./pages/LazyLoadImagePlugin/OfflineDemo";
import OverlayInfoDemo from "./pages/LazyLoadImagePlugin/OverlayInfoDemo";
import ParallaxDemo from "./pages/LazyLoadImagePlugin/ParallaxDemo";
import PerformanceMonitorDemo from "./pages/LazyLoadImagePlugin/PerformanceMonitorDemo";
import PreconnectDemo from "./pages/LazyLoadImagePlugin/PreconnectDemo";
import PredictiveLoadingDemo from "./pages/LazyLoadImagePlugin/PredictiveLoadingDemo";
import PriorityLoadingDemo from "./pages/LazyLoadImagePlugin/PriorityLoadingDemo";
import ProgressOverlayDemo from "./pages/LazyLoadImagePlugin/ProgressOverlayDemo";
import React from "react";
import ReadmeDemo from "./pages/LazyLoadImagePlugin/ReadmeDemo";
import RedactionDemo from "./pages/LazyLoadImagePlugin/RedactionDemo";
import RetryOnErrorDemo from "./pages/LazyLoadImagePlugin/RetryOnErrorDemo";
import ScrollIdleDemo from "./pages/LazyLoadImagePlugin/ScrollIdleDemo";
import SkeletonDemo from "./pages/LazyLoadImagePlugin/SkeletonDemo";
import TransitionDemo from "./pages/LazyLoadImagePlugin/TransitionDemo";
import UserBehaviorDemo from "./pages/LazyLoadImagePlugin/UserBehaviorDemo";
import ViewportAwareDemo from "./pages/LazyLoadImagePlugin/ViewportAwareDemo";
import ViewportDebounceDemo from "./pages/LazyLoadImagePlugin/ViewportDebounceDemo";
import VirtualGridDemo from "./pages/LazyLoadImagePlugin/VirtualGridDemo";
import VirtualHorizontalListDemo from "./pages/LazyLoadImagePlugin/VirtualHorizontalListDemo";
import VirtualVerticalListDemo from "./pages/LazyLoadImagePlugin/VirtualVerticalListDemo";
import WatermarkDemo from "./pages/LazyLoadImagePlugin/WatermarkDemo";

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
          </div>

          <h3 style={{ marginTop: 12 }}>可访问性与 SEO</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <NavLink to="/lli-plugin/a11y">A11y</NavLink>
            <NavLink to="/lli-plugin/alt-text">AltText</NavLink>
            <NavLink to="/lli-plugin/exif-orientation">ExifOrientation</NavLink>
            <NavLink to="/lli-plugin/aspect-ratio-spacer">
              AspectRatioSpacer
            </NavLink>
          </div>
        </nav>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/readme" element={<ReadmeDemo />} />
          <Route path="/lli-plugin/watermark" element={<WatermarkDemo />} />
          <Route path="/lli-plugin/a11y" element={<A11yDemo />} />
          <Route path="/lli-plugin/border-glow" element={<BorderGlowDemo />} />
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
          <Route path="/lli-plugin/error-badge" element={<ErrorBadgeDemo />} />
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
          <Route path="/lli-plugin/concurrency" element={<ConcurrencyDemo />} />
          <Route path="/lli-plugin/scroll-idle" element={<ScrollIdleDemo />} />
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
      </main>
    </div>
  );
};

export default App;
