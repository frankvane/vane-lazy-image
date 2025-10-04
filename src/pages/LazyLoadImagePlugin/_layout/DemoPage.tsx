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
  "/lli-plugin/a11y": "A11yDemo",
  "/lli-plugin/watermark": "WatermarkDemo",
  "/lli-plugin/border-glow": "BorderGlowDemo",
  "/lli-plugin/caption": "CaptionDemo",
  "/lli-plugin/filter": "FilterDemo",
  "/lli-plugin/gallery": "GalleryDemo",
  "/lli-plugin/alt-text": "AltTextDemo",
  "/lli-plugin/aspect-ratio-spacer": "AspectRatioSpacerDemo",
  "/lli-plugin/badge": "BadgeDemo",
  "/lli-plugin/blur-up": "BlurUpDemo",
  "/lli-plugin/cache-prewarm": "CachePrewarmDemo",
  "/lli-plugin/dominant-color": "DominantColorDemo",
  "/lli-plugin/error-badge": "ErrorBadgeDemo",
  "/lli-plugin/error-overlay": "ErrorOverlayDemo",
  "/lli-plugin/event-logger": "EventLoggerDemo",
  "/lli-plugin/fade-in": "FadeInDemo",
  "/lli-plugin/fallback-image": "FallbackImageDemo",
  "/lli-plugin/fetch-loader": "FetchLoaderDemo",
  "/lli-plugin/idb-cache": "IDBCacheDemo",
  "/lli-plugin/lqip": "LqipDemo",
  "/lli-plugin/memory-cache": "MemoryCacheDemo",
  "/lli-plugin/overlay-info": "OverlayInfoDemo",
  "/lli-plugin/preconnect": "PreconnectDemo",
  "/lli-plugin/priority-loading": "PriorityLoadingDemo",
  "/lli-plugin/progress-overlay": "ProgressOverlayDemo",
  "/lli-plugin/retry-on-error": "RetryOnErrorDemo",
  "/lli-plugin/skeleton": "SkeletonDemo",
  "/lli-plugin/concurrency": "ConcurrencyDemo",
  "/lli-plugin/scroll-idle": "ScrollIdleDemo",
  "/lli-plugin/virtual-vertical": "VirtualVerticalListDemo",
  "/lli-plugin/virtual-horizontal": "VirtualHorizontalListDemo",
  "/lli-plugin/virtual-grid": "VirtualGridDemo",
  "/lli-plugin/custom-effects": "CustomEffectsDemo",
  "/lli-plugin/performance-monitor": "PerformanceMonitorDemo",
  "/lli-plugin/error-tracking": "ErrorTrackingDemo",
  "/lli-plugin/auth": "AuthDemo",
  "/lli-plugin/adaptive-quality": "AdaptiveQualityDemo",
  "/lli-plugin/cdn-fallback": "CDNFallbackDemo",
  "/lli-plugin/viewport-aware": "ViewportAwareDemo",
  "/lli-plugin/transition": "TransitionDemo",
  "/lli-plugin/predictive-loading": "PredictiveLoadingDemo",
  "/lli-plugin/data-saver": "DataSaverDemo",
  "/lli-plugin/image-optimization": "ImageOptimizationDemo",
  "/lli-plugin/anti-hotlink": "AntiHotlinkDemo",
  "/lli-plugin/network-analytics": "NetworkAnalyticsDemo",
  "/lli-plugin/viewport-debounce": "ViewportDebounceDemo",
  "/lli-plugin/user-behavior": "UserBehaviorDemo",
  "/lli-plugin/parallax": "ParallaxDemo",
  "/lli-plugin/color-extraction": "ColorExtractionDemo",
  "/lli-plugin/offline": "OfflineDemo",
  "/lli-plugin/crop": "CropDemo",
  "/lli-plugin/comparison": "ComparisonDemo",
  "/lli-plugin/hover-prefetch": "HoverPrefetchDemo",
  "/lli-plugin/memory-abort": "MemoryPressureAbortDemo",
  "/lli-plugin/decode-idle": "DecodeAfterIdleDemo",
  "/lli-plugin/battery-aware": "BatteryAwareDemo",
  "/lli-plugin/exif-orientation": "ExifOrientationDemo",
  "/lli-plugin/redaction": "RedactionDemo",
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
      if (fileName) {
        try {
          // 动态导入源码文件（使用 ?raw 后缀）
          const module = await import(`../${fileName}.tsx?raw`);
          setSourceCode(module.default);
        } catch (error) {
          console.error("加载源码失败:", error);
          setSourceCode("// 源码加载失败");
        }
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
