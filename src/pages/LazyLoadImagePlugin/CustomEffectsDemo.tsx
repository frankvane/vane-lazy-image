import {
  LazyLoadImageCore,
  createA11yPlugin,
  createBlurUpPlugin,
  createBorderGlowPlugin,
  createCaptionPlugin,
  createFilterPlugin,
  createGalleryPlugin,
  createHoverZoomPlugin,
  createResponsivePlugin,
  createSEOPlugin,
  createSkeletonPlugin,
  createSvgPlaceholderPlugin,
  createWebPPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const samples = Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  src: `https://picsum.photos/seed/effects-${i}/800/600`,
}));

export default function CustomEffectsDemo() {
  // 各效果单独演示
  const SvgPlaceholderImage = React.useMemo(() => {
    const svg = `
<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e5e7eb"/>
      <stop offset="50%" stop-color="#f3f4f6"/>
      <stop offset="100%" stop-color="#e5e7eb"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="120" height="90" fill="#f3f4f6" rx="8"/>
  <circle cx="60" cy="40" r="18" fill="url(#grad)">
    <animate attributeName="r" values="14;18;14" dur="1.2s" repeatCount="indefinite" />
  </circle>
  <rect x="36" y="30" width="48" height="20" rx="4" fill="#e5e7eb" opacity="0.6" />
  <text x="60" y="76" text-anchor="middle" font-size="10" fill="#9ca3af">Loading…</text>
</svg>`;

    return withPlugins(LazyLoadImageCore as any, [
      createSvgPlaceholderPlugin({
        svgContent: svg,
        background: "transparent",
        showWhen: "loading",
        zIndex: 4,
        fadeOutOnLoaded: true,
        opacity: 1,
      }),
      createBlurUpPlugin({ startBlur: 10, endBlur: 0, durationMs: 600 }),
    ]);
  }, []);

  // WebP - 优先加载 webp，失败快速回退
  const WebPImage = React.useMemo(() => {
    return withPlugins(LazyLoadImageCore as any, [
      createWebPPlugin({
        replaceExtensions: ["jpg", "jpeg", "png"],
        testSupport: true,
      }),
      createBlurUpPlugin({ startBlur: 8, endBlur: 0, durationMs: 400 }),
    ]);
  }, []);

  // Responsive - 注入 srcset/sizes（示例使用 picsum 的路径方案）
  const ResponsiveImage = React.useMemo(() => {
    const variants = [{ width: 400 }, { width: 800 }, { width: 1200 }];
    const buildSrc = (base: string, w: number) => {
      // 基于示例基础链接推导不同宽高（4:3 比例）
      const h = Math.round(w * 0.75);
      try {
        const u = new URL(base);
        const parts = u.pathname.split("/");
        // 将最后两个段替换为 w/h
        parts[parts.length - 2] = String(w);
        parts[parts.length - 1] = String(h);
        u.pathname = parts.join("/");
        return u.toString();
      } catch {
        return base;
      }
    };
    return withPlugins(LazyLoadImageCore as any, [
      createResponsivePlugin({
        variants,
        buildSrc,
        sizes: "(max-width: 800px) 100vw, 800px",
      }),
      createBlurUpPlugin({ startBlur: 10, endBlur: 0, durationMs: 600 }),
    ]);
  }, []);

  // SEO - alt 回退 + 固定长宽比 + LCP 提升
  const SEOImage = React.useMemo(() => {
    return withPlugins(LazyLoadImageCore as any, [
      createSEOPlugin({
        altFallback: "示例图片",
        aspectRatio: "4/3",
        priority: "lcp",
        preload: true,
        title: "演示图像",
      }),
      createBlurUpPlugin({ startBlur: 8, endBlur: 0, durationMs: 400 }),
    ]);
  }, []);

  // A11y - 可访问状态与装饰性图片处理
  const A11yImage = React.useMemo(() => {
    return withPlugins(LazyLoadImageCore as any, [
      createA11yPlugin({
        enabled: true,
        decorative: false,
        ariaLabel: (ctx) => `图片资源：${ctx.src.split("/").pop()}`,
        statusText: {
          loading: "图片加载中…",
          loaded: "图片加载完成",
          error: "图片加载失败",
        },
      }),
      createBlurUpPlugin({ startBlur: 8, endBlur: 0, durationMs: 400 }),
    ]);
  }, []);
  const GalleryImage = React.useMemo(() => {
    return withPlugins(LazyLoadImageCore as any, [
      createGalleryPlugin({
        buttonText: "Open",
        enableLightbox: true,
        overlayZIndex: 20,
      }),
      createBlurUpPlugin({ startBlur: 10, endBlur: 0, durationMs: 600 }),
      createSkeletonPlugin({
        type: "shimmer",
        showWhen: "loading",
        borderRadius: 8,
        zIndex: 1,
      }),
    ]);
  }, []);

  const FilterImage = React.useMemo(() => {
    return withPlugins(LazyLoadImageCore as any, [
      createFilterPlugin({ filter: "grayscale", amount: 1, hover: true }),
      createSkeletonPlugin({
        type: "shimmer",
        showWhen: "loading",
        borderRadius: 8,
        zIndex: 1,
      }),
    ]);
  }, []);

  const HoverZoomImage = React.useMemo(() => {
    return withPlugins(LazyLoadImageCore as any, [
      createHoverZoomPlugin({ scale: 1.15, durationMs: 180 }),
      createBlurUpPlugin({ startBlur: 10, endBlur: 0, durationMs: 600 }),
      createSkeletonPlugin({
        type: "shimmer",
        showWhen: "loading",
        borderRadius: 8,
        zIndex: 1,
      }),
    ]);
  }, []);

  const CaptionImage = React.useMemo(() => {
    return withPlugins(LazyLoadImageCore as any, [
      createCaptionPlugin({
        text: (src) => `Caption • ${src?.slice(0, 28)}...`,
        position: "bottom",
      }),
      createBlurUpPlugin({ startBlur: 10, endBlur: 0, durationMs: 600 }),
      createSkeletonPlugin({
        type: "shimmer",
        showWhen: "loading",
        borderRadius: 8,
        zIndex: 1,
      }),
    ]);
  }, []);

  const BorderGlowImage = React.useMemo(() => {
    return withPlugins(LazyLoadImageCore as any, [
      createBorderGlowPlugin({
        color: "rgba(0,153,255,0.85)",
        blurPx: 18,
        spreadPx: 6,
      }),
      createBlurUpPlugin({ startBlur: 10, endBlur: 0, durationMs: 600 }),
      createSkeletonPlugin({
        type: "shimmer",
        showWhen: "loading",
        borderRadius: 8,
        zIndex: 1,
      }),
    ]);
  }, []);

  // 组合演示
  const CombinedImage = React.useMemo(() => {
    return withPlugins(LazyLoadImageCore as any, [
      createCaptionPlugin({
        text: (src) => `Effects • ${src?.slice(0, 28)}...`,
        position: "bottom",
      }),
      createFilterPlugin({ filter: "grayscale", amount: 1, hover: true }),
      createHoverZoomPlugin({ scale: 1.15, durationMs: 180 }),
      createBorderGlowPlugin({
        color: "rgba(0,153,255,0.6)",
        blurPx: 12,
        spreadPx: 2,
      }),
      createGalleryPlugin({ buttonText: "Open", enableLightbox: true }),
      createSkeletonPlugin({
        type: "shimmer",
        showWhen: "loading",
        borderRadius: 8,
        zIndex: 1,
      }),
    ]);
  }, []);

  return (
    <DemoPage
      title="LazyLoadImagePlugin • 效果插件演示"
      description="分区展示 SVG Placeholder / Gallery / Filter / HoverZoom / Caption / BorderGlow，以及最后的组合效果"
    >
      {/* SVG Placeholder */}
      <section style={{ marginBottom: 24 }}>
        <h4 style={{ margin: "8px 0" }}>SVG Placeholder（加载时叠加显示）</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {samples.map((item) => (
            <div
              key={`sp-${item.id}`}
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "75%",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ position: "absolute", inset: 0 }}>
                <SvgPlaceholderImage
                  src={item.src}
                  loading="lazy"
                  rootMargin="240px"
                  containerStyle={{ width: "100%", height: "100%" }}
                  imageStyle={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section style={{ marginBottom: 24 }}>
        <h4 style={{ margin: "8px 0" }}>Gallery（灯箱）</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {samples.map((item) => (
            <div
              key={`g-${item.id}`}
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "75%",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ position: "absolute", inset: 0 }}>
                <GalleryImage
                  src={item.src}
                  loading="lazy"
                  rootMargin="240px"
                  containerStyle={{ width: "100%", height: "100%" }}
                  imageStyle={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filter */}
      <section style={{ marginBottom: 24 }}>
        <h4 style={{ margin: "8px 0" }}>Filter（灰度 + 悬停取消）</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {samples.map((item) => (
            <div
              key={`f-${item.id}`}
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "75%",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ position: "absolute", inset: 0 }}>
                <FilterImage
                  src={item.src}
                  loading="lazy"
                  rootMargin="240px"
                  containerStyle={{ width: "100%", height: "100%" }}
                  imageStyle={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hover Zoom */}
      <section style={{ marginBottom: 24 }}>
        <h4 style={{ margin: "8px 0" }}>HoverZoom（悬停放大）</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {samples.map((item) => (
            <div
              key={`hz-${item.id}`}
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "75%",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ position: "absolute", inset: 0 }}>
                <HoverZoomImage
                  src={item.src}
                  loading="lazy"
                  rootMargin="240px"
                  containerStyle={{ width: "100%", height: "100%" }}
                  imageStyle={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Caption */}
      <section style={{ marginBottom: 24 }}>
        <h4 style={{ margin: "8px 0" }}>Caption（底部文案）</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {samples.map((item) => (
            <div
              key={`c-${item.id}`}
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "75%",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ position: "absolute", inset: 0 }}>
                <CaptionImage
                  src={item.src}
                  loading="lazy"
                  rootMargin="240px"
                  containerStyle={{ width: "100%", height: "100%" }}
                  imageStyle={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WebP 优先 */}
      <section style={{ marginBottom: 24 }}>
        <h4 style={{ margin: "8px 0" }}>WebP（支持检测与失败回退）</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {[
            { id: "w1", src: "https://www.gstatic.com/webp/gallery/1.jpg" },
            { id: "w2", src: "https://www.gstatic.com/webp/gallery/2.jpg" },
            { id: "w3", src: "https://www.gstatic.com/webp/gallery/3.jpg" },
            { id: "w4", src: "https://www.gstatic.com/webp/gallery/4.jpg" },
          ].map((item) => (
            <div
              key={item.id}
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "75%",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ position: "absolute", inset: 0 }}>
                <WebPImage
                  src={item.src}
                  loading="lazy"
                  rootMargin="240px"
                  containerStyle={{ width: "100%", height: "100%" }}
                  imageStyle={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Responsive 响应式 */}
      <section style={{ marginBottom: 24 }}>
        <h4 style={{ margin: "8px 0" }}>Responsive（srcset + sizes）</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {samples.map((item) => (
            <div
              key={`r-${item.id}`}
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "75%",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ position: "absolute", inset: 0 }}>
                <ResponsiveImage
                  src={item.src}
                  loading="lazy"
                  rootMargin="240px"
                  containerStyle={{ width: "100%", height: "100%" }}
                  imageStyle={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO 优化 */}
      <section style={{ marginBottom: 24 }}>
        <h4 style={{ margin: "8px 0" }}>SEO（alt 回退 + 预加载 + 固定比例）</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {samples.map((item) => (
            <div
              key={`seo-${item.id}`}
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "75%",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ position: "absolute", inset: 0 }}>
                <SEOImage
                  src={item.src}
                  loading="lazy"
                  rootMargin="240px"
                  containerStyle={{ width: "100%", height: "100%" }}
                  imageStyle={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* A11y 可访问性 */}
      <section style={{ marginBottom: 24 }}>
        <h4 style={{ margin: "8px 0" }}>A11y（状态可读 + aria 属性）</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {samples.map((item) => (
            <div
              key={`ax-${item.id}`}
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "75%",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ position: "absolute", inset: 0 }}>
                <A11yImage
                  src={item.src}
                  loading="lazy"
                  rootMargin="240px"
                  containerStyle={{ width: "100%", height: "100%" }}
                  imageStyle={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Border Glow */}
      <section style={{ marginBottom: 24 }}>
        <h4 style={{ margin: "8px 0" }}>BorderGlow（发光边框）</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {samples.map((item) => (
            <div
              key={`bg-${item.id}`}
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "75%",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ position: "absolute", inset: 0 }}>
                <BorderGlowImage
                  src={item.src}
                  loading="lazy"
                  rootMargin="240px"
                  containerStyle={{ width: "100%", height: "100%" }}
                  imageStyle={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Combined */}
      <section>
        <h4 style={{ margin: "8px 0" }}>组合效果</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {samples.map((item) => (
            <div
              key={`co-${item.id}`}
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "75%",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ position: "absolute", inset: 0 }}>
                <CombinedImage
                  src={item.src}
                  loading="lazy"
                  rootMargin="240px"
                  containerStyle={{ width: "100%", height: "100%" }}
                  imageStyle={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </DemoPage>
  );
}
