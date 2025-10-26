import React, { useEffect, useState } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useLocation } from "react-router-dom";

type DemoPageProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

// 路由路径到文件名的映射
const routeToFileMap: Record<string, string> = {
  // 基础示例
  "/readme": "ReadmeDemo",

  // 视觉与效果
  "/lli-plugin/watermark": "WatermarkDemo",
  "/lli-plugin/border-glow": "BorderGlowDemo",
  "/lli-plugin/caption": "CaptionDemo",
  "/lli-plugin/filter": "FilterDemo",
  "/lli-plugin/gallery": "GalleryDemo",
  "/lli-plugin/overlay-info": "OverlayInfoDemo",
  "/lli-plugin/progress-overlay": "ProgressOverlayDemo",
  "/lli-plugin/skeleton": "SkeletonDemo",
  "/lli-plugin/blur-up": "BlurUpDemo",
  "/lli-plugin/fade-in": "FadeInDemo",
  "/lli-plugin/custom-effects": "CustomEffectsDemo",
  "/lli-plugin/transition": "TransitionDemo",
  "/lli-plugin/parallax": "ParallaxDemo",
  "/lli-plugin/color-extraction": "ColorExtractionDemo",
  "/lli-plugin/redaction": "RedactionDemo",
  "/lli-plugin/badge": "BadgeDemo",
  "/lli-plugin/dominant-color": "DominantColorDemo",
  "/lli-plugin/hover-zoom": "HoverZoomDemo",

  // 性能与网络
  "/lli-plugin/preconnect": "PreconnectDemo",
  "/lli-plugin/priority-loading": "PriorityLoadingDemo",
  "/lli-plugin/cache-prewarm": "CachePrewarmDemo",
  "/lli-plugin/memory-cache": "MemoryCacheDemo",
  "/lli-plugin/idb-cache": "IDBCacheDemo",
  "/lli-plugin/concurrency": "ConcurrencyDemo",
  "/lli-plugin/scroll-idle": "ScrollIdleDemo",
  "/lli-plugin/network-analytics": "NetworkAnalyticsDemo",
  "/lli-plugin/predictive-loading": "PredictiveLoadingDemo",
  "/lli-plugin/data-saver": "DataSaverDemo",
  "/lli-plugin/image-optimization": "ImageOptimizationDemo",
  "/lli-plugin/fetch-loader": "FetchLoaderDemo",
  "/lli-plugin/global-context": "GlobalContextDemo",
  "/lli-plugin/observer-pool": "ObserverPoolDemo",
  "/lli-plugin/performance-optimization": "PerformanceOptimizationDemo",

  // 稳健性与错误处理
  "/lli-plugin/error-badge": "ErrorBadgeDemo",
  "/lli-plugin/error-overlay": "ErrorOverlayDemo",
  "/lli-plugin/fallback-image": "FallbackImageDemo",
  "/lli-plugin/retry-on-error": "RetryOnErrorDemo",
  "/lli-plugin/error-tracking": "ErrorTrackingDemo",
  "/lli-plugin/offline": "OfflineDemo",
  "/lli-plugin/memory-abort": "MemoryPressureAbortDemo",
  "/lli-plugin/decode-idle": "DecodeAfterIdleDemo",
  "/lli-plugin/anti-hotlink": "AntiHotlinkDemo",
  "/lli-plugin/cdn-fallback": "CDNFallbackDemo",
  "/lli-plugin/auth": "AuthDemo",

  // 视口与交互
  "/lli-plugin/viewport-aware": "ViewportAwareDemo",
  "/lli-plugin/viewport-debounce": "ViewportDebounceDemo",
  "/lli-plugin/hover-prefetch": "HoverPrefetchDemo",
  "/lli-plugin/virtual-vertical": "VirtualVerticalListDemo",
  "/lli-plugin/virtual-horizontal": "VirtualHorizontalListDemo",
  "/lli-plugin/virtual-grid": "VirtualGridDemo",
  "/lli-plugin/user-behavior": "UserBehaviorDemo",
  "/lli-plugin/viewport-dwell": "ViewportDwellDemo",

  // 可访问性与 SEO
  "/lli-plugin/a11y": "A11yDemo",
  "/lli-plugin/alt-text": "AltTextDemo",
  "/lli-plugin/exif-orientation": "ExifOrientationDemo",
  "/lli-plugin/aspect-ratio-spacer": "AspectRatioSpacerDemo",
  "/lli-plugin/responsive": "ResponsiveDemo",
  "/lli-plugin/seo": "SEODemo",

  // 其他功能
  "/lli-plugin/event-logger": "EventLoggerDemo",
  "/lli-plugin/lqip": "LqipDemo",
  "/lli-plugin/performance-monitor": "PerformanceMonitorDemo",
  "/lli-plugin/adaptive-quality": "AdaptiveQualityDemo",
  "/lli-plugin/crop": "CropDemo",
  "/lli-plugin/comparison": "ComparisonDemo",
  "/lli-plugin/battery-aware": "BatteryAwareDemo",
  "/lli-plugin/svg-placeholder": "SvgPlaceholderDemo",
  "/lli-plugin/webp": "WebPDemo",

  // 高级功能
  "/lli-plugin/plugin-sandbox": "PluginSandboxDemo",
  "/lli-plugin/performance-monitoring": "PerformanceMonitoringDemo",
  "/lli-plugin/plugin-hot-reload": "PluginHotReloadDemo",
  "/lli-plugin/dependency-resolver": "DependencyResolverDemo",

  // 组合示例
  "/lli-plugin/combo/error-resilience": "ComboErrorResilienceDemo",
  "/lli-plugin/combo/performance": "ComboPerformanceDemo",
  "/lli-plugin/combo/visual-effects": "ComboVisualEffectsDemo",
  "/lli-plugin/combo/cache-storage": "ComboCacheDemo",
  "/lli-plugin/combo/viewport-interaction": "ComboViewportInteractionDemo",
  "/lli-plugin/combo/a11y-seo": "ComboA11ySeoDemo",
  "/lli-plugin/combo/visual-effects-plus": "ComboVisualEffectsPlusDemo",
  "/lli-plugin/combo/responsive-seo-webp": "ComboResponsiveSeoWebPDemo",
  "/lli-plugin/combo/interaction-overlay": "ComboInteractionOverlayDemo",
};

const DemoPage: React.FC<DemoPageProps> = ({
  title,
  description,
  children,
}) => {
  const location = useLocation();
  const [sourceCode, setSourceCode] = useState<string>("");

  useEffect(() => {
    const loadSourceCode = async () => {
      // 获取当前路由对应的文件名
      const fileName = routeToFileMap[location.pathname];

      // 调试日志
      console.log('[DemoPage] Current pathname:', location.pathname);
      console.log('[DemoPage] Mapped fileName:', fileName);

      if (fileName) {
        try {
          // 动态导入源码文件（使用 ?raw 后缀）
          const module = await import(`../${fileName}.tsx?raw`);
          setSourceCode(module.default);
        } catch (error) {
          console.error("加载源码失败:", error, "fileName:", fileName);
          setSourceCode("// 源码加载失败");
        }
      } else {
        console.warn('[DemoPage] No fileName mapping found for:', location.pathname);
      }
    };

    loadSourceCode();
  }, [location.pathname]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        {description ? <p className="page-desc">{description}</p> : null}
      </div>
      <div className="page-card">{children}</div>

      {sourceCode && (
        <div className="page-card" style={{ marginTop: "20px" }}>
          <h2 style={{ marginBottom: "10px", fontSize: "1.2em" }}>源码</h2>
          <SyntaxHighlighter
            language="tsx"
            style={tomorrow}
            showLineNumbers={true}
            wrapLines={true}
            wrapLongLines={true}
            customStyle={{
              borderRadius: "4px",
              fontSize: "14px",
              lineHeight: "1.5",
              margin: 0,
              maxHeight: "600px",
              overflow: "auto",
            }}
          >
            {sourceCode}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};

export default DemoPage;
