# 🖼️ Vane Lazy Image

一个功能强大、高度可扩展的 React 图片懒加载组件库

[![NPM Version](https://img.shields.io/badge/npm-v1.0.9-blue)](https://www.npmjs.com/package/vane-lazy-image)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)

[在线演示](https://chinavane.netlify.app/) | [快速开始](#快速开始) | [插件列表](#插件列表) | [API 文档](#api-文档)

</div>

---

## ✨ 核心特性

### 🔌 **插件化架构**

- 基于事件总线的插件系统，支持灵活组合
- 60+ 内置插件，覆盖各种使用场景
- 易于扩展，支持自定义插件开发

### 🎨 **丰富的视觉效果**

- 水印、模糊占位（BlurUp）、渐变过渡
- 滤镜、边框发光、视差滚动
- 骨架屏、进度条、信息叠层
- 支持自定义 CSS 效果组合

### ⚡ **性能优化**

- 优先级加载控制
- 预连接（Preconnect）降低网络延迟
- 并发控制，避免资源竞争
- 内存缓存 + IndexedDB 持久化缓存
- 滚动空闲检测，优化用户体验

### 🛡️ **错误处理**

- 智能重试机制（指数退避）
- CDN 回退策略
- 降级加载（Fallback Image）
- 离线缓存支持
- 错误追踪与上报

### ♿ **可访问性与 SEO**

- ARIA 属性自动注入
- Alt 文本智能填充
- 结构化数据支持
- 搜索引擎优化
- 符合 WCAG 2.1 标准

### 📊 **监控与分析**

- 性能指标采集
- 网络分析与上报
- 用户行为追踪
- 加载时序统计
- 自定义事件日志

---

## 📦 安装

### NPM / Yarn / PNPM

```bash
# npm
npm install vane-lazy-image

# yarn
yarn add vane-lazy-image

# pnpm
pnpm add vane-lazy-image
```

### 本地开发

如果您想本地运行演示站点或进行二次开发：

```bash
# 克隆仓库
git clone https://github.com/frankvane/vane-lazy-image.git

# 进入项目目录
cd vane-lazy-image

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建产物
npm run preview
```

---

## 📊 包大小与优化

### 模块大小

| 模块     | 原始大小 | Gzip 后 | 说明                               |
| -------- | -------- | ------- | ---------------------------------- |
| 核心组件 | ~8 KB    | ~3 KB   | `LazyLoadImageCore` 仅包含基础功能 |
| 插件系统 | ~12 KB   | ~4 KB   | 插件管理器 + 事件总线              |
| 单个插件 | ~2-5 KB  | ~1-2 KB | 每个插件平均大小                   |
| 完整包   | ~280 KB  | ~85 KB  | 包含所有 60+ 插件                  |

> 💡 **提示**：使用按需导入可以大幅减小最终打包体积，推荐生产环境使用。

### Tree-Shaking 支持

本库完全支持 **Tree-Shaking**，未使用的插件不会被打包到最终产物中。

#### 为什么支持 Tree-Shaking？

1. **ESM 模块格式**：采用 ES Module 格式发布，便于静态分析
2. **无副作用标记**：在 `package.json` 中设置 `"sideEffects": false`
3. **命名导出**：所有功能都使用命名导出，而非默认导出
4. **独立模块**：每个插件都是独立的模块，可单独引入

```json
// package.json
{
  "sideEffects": false, // ✅ 标记整个包无副作用
  "module": "dist/index.es.js", // ✅ ESM 格式入口
  "exports": {
    ".": {
      "import": "./dist/index.es.js", // ✅ ESM 导出
      "types": "./dist/index.d.ts"
    }
  }
}
```

#### ✅ 支持 Tree-Shaking 的导入方式

```tsx
// 推荐：按需导入（支持 Tree-Shaking）
import {
  LazyLoadImageCore,
  withPlugins,
  createWatermarkPlugin,
  createFadeInPlugin,
} from "vane-lazy-image";

// 只会打包使用到的插件
// 最终大小：~13 KB (核心 + 系统 + 2个插件)
```

#### ⚠️ 不推荐的导入方式

```tsx
// ❌ 不推荐：导入所有插件
import * as LazyImage from "vane-lazy-image";

// 会打包所有 60+ 插件
// 最终大小：~280 KB
```

### 按需导入示例

#### 方式一：精确导入（最小体积）

```tsx
// 仅导入需要的功能
import { LazyLoadImageCore } from "vane-lazy-image/core";
import { withPlugins } from "vane-lazy-image/plugins";
import { createWatermarkPlugin } from "vane-lazy-image/custom-plugins/WatermarkPlugin";
import { createFadeInPlugin } from "vane-lazy-image/custom-plugins/FadeInPlugin";

// 打包大小：~15 KB (最小)
```

#### 方式二：分类导入（推荐）

```tsx
// 从主入口导入核心和常用插件
import {
  LazyLoadImageCore,
  withPlugins,
  createWatermarkPlugin,
  createFadeInPlugin,
  createRetryOnErrorPlugin,
} from "vane-lazy-image";

// 打包大小：~18 KB (核心 + 3个插件)
```

#### 方式三：分组导入

```tsx
// 视觉效果插件组
import {
  createWatermarkPlugin,
  createFadeInPlugin,
  createBlurUpPlugin,
  createSkeletonPlugin,
} from "vane-lazy-image";

// 性能优化插件组
import {
  createPreconnectPlugin,
  createMemoryCachePlugin,
  createConcurrencyControlPlugin,
} from "vane-lazy-image";

// 打包大小：~35 KB (核心 + 7个插件)
```

### 不同场景的包大小对比

| 使用场景         | 导入插件数 | 预估大小（Gzip） |
| ---------------- | ---------- | ---------------- |
| 最小化（仅核心） | 0          | ~3 KB            |
| 基础使用         | 2-3 个     | ~8-12 KB         |
| 常规项目         | 5-8 个     | ~15-25 KB        |
| 功能丰富         | 10-15 个   | ~30-45 KB        |
| 完整功能         | 60+ 个     | ~85 KB           |

### 打包优化建议

#### 1. 使用动态导入

对于大型插件或不常用的功能，可以使用动态导入：

```tsx
import { LazyLoadImageCore, withPlugins } from "vane-lazy-image";

// 基础插件立即加载
const basePlugins = [createFadeInPlugin()];

// 大型插件按需加载
async function loadAdvancedPlugins() {
  const { createGalleryPlugin } = await import("vane-lazy-image");
  const { createParallaxPlugin } = await import("vane-lazy-image");

  return [createGalleryPlugin(), createParallaxPlugin()];
}

// 根据需要组合插件
const LazyImage = withPlugins(LazyLoadImageCore as any, basePlugins);
```

#### 2. CDN 方式引入

对于不需要 Tree-Shaking 的场景，可以使用 CDN：

```html
<!-- 使用 unpkg -->
<script src="https://unpkg.com/vane-lazy-image@latest/dist/index.umd.js"></script>

<!-- 使用 jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/vane-lazy-image@latest/dist/index.umd.js"></script>
```

#### 3. Vite 配置优化

```typescript
// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将懒加载图片库单独打包
          "lazy-image": ["vane-lazy-image"],
        },
      },
    },
  },
});
```

#### 4. Webpack 配置优化

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true, // 启用 Tree-Shaking
    sideEffects: false, // 标记所有文件无副作用
    splitChunks: {
      cacheGroups: {
        lazyImage: {
          test: /[\\/]node_modules[\\/]vane-lazy-image[\\/]/,
          name: "lazy-image",
          chunks: "all",
        },
      },
    },
  },
};
```

### 验证 Tree-Shaking 效果

#### 方法一：使用打包分析工具

```bash
# Vite 项目
npm run build
npx vite-bundle-visualizer

# 或使用 rollup-plugin-visualizer
npm install --save-dev rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
```

#### 方法二：Webpack Bundle Analyzer

```bash
npm install --save-dev webpack-bundle-analyzer
```

```javascript
// webpack.config.js
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: true,
    }),
  ],
};
```

#### 方法三：手动检查打包产物

```bash
# 构建项目
npm run build

# 查看打包后的文件大小
ls -lh dist/assets/*.js

# 或使用 du 命令
du -sh dist/assets/*.js
```

#### 方法四：比较测试

创建两个测试文件进行对比：

```tsx
// test-full.tsx - 导入所有插件
import * as LazyImage from "vane-lazy-image";

// test-minimal.tsx - 仅导入需要的插件
import {
  LazyLoadImageCore,
  withPlugins,
  createWatermarkPlugin,
} from "vane-lazy-image";
```

分别打包后对比文件大小，验证 Tree-Shaking 效果。

### 查看实际打包大小

使用打包分析工具查看实际大小：

```bash
# Vite 项目
npm run build
npx vite-bundle-visualizer

# Webpack 项目
npm install --save-dev webpack-bundle-analyzer
# 在 webpack.config.js 中配置分析工具
```

### 性能监控

使用浏览器开发者工具监控加载性能：

```tsx
import { createPerformanceMonitorPlugin } from "vane-lazy-image";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createPerformanceMonitorPlugin({
    onMetric: (metrics) => {
      console.log("性能指标", {
        loadTime: metrics.loadTime,
        renderTime: metrics.renderTime,
        totalTime: metrics.totalTime,
      });
    },
  }),
]);
```

---

## 🚀 快速开始

### 基础使用

最简单的使用方式，不带任何插件：

```tsx
import { LazyLoadImageCore } from "vane-lazy-image";

function App() {
  return (
    <div style={{ width: 480, height: 300 }}>
      <LazyLoadImageCore
        src="https://picsum.photos/800/600"
        alt="示例图片"
        loading="lazy"
        containerStyle={{ width: "100%", height: "100%" }}
        imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}
```

### 使用插件

通过 `withPlugins` 高阶组件组合多个插件：

```tsx
import {
  LazyLoadImageCore,
  withPlugins,
  createWatermarkPlugin,
  createFadeInPlugin,
  createRetryOnErrorPlugin,
} from "vane-lazy-image";

// 组合插件
const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createWatermarkPlugin({
    text: "VANE",
    position: "bottom-right",
    opacity: 0.6,
  }),
  createFadeInPlugin({
    duration: 600,
    timingFunction: "ease-in-out",
  }),
  createRetryOnErrorPlugin({
    maxRetries: 3,
    retryDelay: 1000,
  }),
]);

function App() {
  return (
    <div style={{ width: 480, height: 300 }}>
      <LazyImage
        src="https://picsum.photos/800/600"
        alt="带插件的图片"
        loading="lazy"
        containerStyle={{ width: "100%", height: "100%" }}
        imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}
```

### 组合示例：性能优化

```tsx
import {
  LazyLoadImageCore,
  withPlugins,
  createPreconnectPlugin,
  createPriorityLoadingPlugin,
  createImageOptimizationPlugin,
  createMemoryCachePlugin,
  createConcurrencyControlPlugin,
} from "vane-lazy-image";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createPreconnectPlugin({
    domains: ["https://images.example.com"],
  }),
  createPriorityLoadingPlugin({
    loading: "lazy",
    rootMargin: "200px",
  }),
  createImageOptimizationPlugin({
    widthParam: "w",
    qualityParam: "q",
    defaultQuality: 80,
  }),
  createMemoryCachePlugin({
    maxSize: 50,
  }),
  createConcurrencyControlPlugin({
    maxConcurrent: 4,
  }),
]);

export default function PerformanceDemo() {
  const images = [
    "https://images.example.com/photo1.jpg",
    "https://images.example.com/photo2.jpg",
    "https://images.example.com/photo3.jpg",
  ];

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {images.map((src, i) => (
        <LazyImage
          key={i}
          src={src}
          alt={`图片 ${i + 1}`}
          loading="lazy"
          containerStyle={{ width: 320, height: 200 }}
          imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ))}
    </div>
  );
}
```

---

## 📚 插件列表

本项目提供 60+ 个开箱即用的插件，按功能分类如下：

### 🎨 视觉与效果（15 个）

| 插件                          | 说明                             |
| ----------------------------- | -------------------------------- |
| `createWatermarkPlugin`       | 为图片叠加水印文本或标识         |
| `createBadgePlugin`           | 添加角标或状态标记               |
| `createProgressOverlayPlugin` | 加载进度条与百分比文本覆盖层     |
| `createSkeletonPlugin`        | 骨架屏遮罩，支持 shimmer 动画    |
| `createOverlayInfoPlugin`     | 信息蒙层，支持顶部/底部/居中显示 |
| `createBlurUpPlugin`          | 从模糊到清晰的渐进过渡效果       |
| `createFadeInPlugin`          | 图片淡入动画                     |
| `createDominantColorPlugin`   | 提取主色用于背景占位             |
| `createGalleryPlugin`         | 大图/灯箱查看能力                |
| `createFilterPlugin`          | CSS 滤镜，支持悬停交互           |
| `createCaptionPlugin`         | 图片说明文字叠层                 |
| `createBorderGlowPlugin`      | 边框发光视觉效果                 |
| `createParallaxPlugin`        | 视差滚动效果                     |
| `createColorExtractionPlugin` | 颜色提取用于背景/主题            |
| `createRedactionPlugin`       | 敏感信息遮蔽/打码处理            |

### ⚡ 性能与网络（12 个）

| 插件                             | 说明                       |
| -------------------------------- | -------------------------- |
| `createPreconnectPlugin`         | 预连接目标域名，降低延迟   |
| `createPriorityLoadingPlugin`    | 控制加载优先级策略         |
| `createCachePrewarmPlugin`       | 缓存预热与链接提前建立     |
| `createMemoryCachePlugin`        | 内存缓存策略               |
| `createIDBCachePlugin`           | IndexedDB 持久缓存         |
| `createConcurrencyControlPlugin` | 限制并发加载数量           |
| `createScrollIdlePlugin`         | 滚动空闲后再加载           |
| `createNetworkAnalyticsPlugin`   | 网络事件与性能数据上报     |
| `createPredictiveLoadingPlugin`  | 预测性预加载下一个资源     |
| `createDataSaverPlugin`          | 省流模式降级策略           |
| `createImageOptimizationPlugin`  | 图片参数优化（尺寸、质量） |
| `createHoverPrefetchPlugin`      | 悬停预取资源               |

### 🛡️ 稳健性与错误处理（11 个）

| 插件                              | 说明                       |
| --------------------------------- | -------------------------- |
| `createErrorBadgePlugin`          | 失败状态显示角标           |
| `createErrorOverlayPlugin`        | 加载失败覆盖层提示         |
| `createFallbackImagePlugin`       | 失败回退到备用图片         |
| `createRetryOnErrorPlugin`        | 错误重试与退避策略         |
| `createErrorTrackingPlugin`       | 错误追踪与上报             |
| `createOfflinePlugin`             | 离线占位与状态提示         |
| `createMemoryPressureAbortPlugin` | 内存压力触发取消请求       |
| `createDecodeAfterIdlePlugin`     | 空闲后再解码               |
| `createAntiHotlinkPlugin`         | 防盗链策略                 |
| `createCDNFallbackPlugin`         | CDN 失败回退主源           |
| `createAuthPlugin`                | 鉴权/携带 token 的资源加载 |

### 👆 视口与交互（7 个）

| 插件                           | 说明                   |
| ------------------------------ | ---------------------- |
| `createViewportAwarePlugin`    | 细粒度的视口状态管理   |
| `createViewportDebouncePlugin` | 视口变化防抖处理       |
| `createViewportDwellPlugin`    | 基于驻留时长的加载策略 |
| `createUserBehaviorPlugin`     | 用户行为统计           |
| `createHoverZoomPlugin`        | 悬停放大交互           |
| `createComparisonPlugin`       | 前后对比滑块           |
| `createCropPlugin`             | 裁剪与展示区域控制     |

### ♿ 可访问性与 SEO（6 个）

| 插件                            | 说明                       |
| ------------------------------- | -------------------------- |
| `createA11yPlugin`              | 可访问性增强（ARIA、焦点） |
| `createAltTextPlugin`           | Alt 文本智能填充           |
| `createSEOPlugin`               | 搜索引擎优化               |
| `createAspectRatioSpacerPlugin` | 按长宽比占位减少布局偏移   |
| `createExifOrientationPlugin`   | EXIF 方向矫正              |
| `createResponsivePlugin`        | 响应式 srcset/sizes 管理   |

### 🔧 其他（9 个）

| 插件                             | 说明                      |
| -------------------------------- | ------------------------- |
| `createEventLoggerPlugin`        | 事件日志打印与上报        |
| `createPerformanceMonitorPlugin` | 性能指标采集              |
| `createLqipPlugin`               | 低质量图像占位（LQIP）    |
| `createSvgPlaceholderPlugin`     | SVG 占位图渲染            |
| `createWebPPlugin`               | WebP 优先加载与回退       |
| `createAdaptiveQualityPlugin`    | 基于网络/设备的自适应质量 |
| `createBatteryAwarePlugin`       | 电量/省电模式适配         |
| `createTransitionPlugin`         | 统一管理加载过渡效果      |
| `FetchLoaderPlugin`              | 自定义 Fetch 加载器       |

> 💡 **提示**：所有插件都可以通过 `vane-lazy-image` 包导入。详细配置请参考 [API 文档](#api-文档) 或查看 [在线演示](https://chinavane.netlify.app/)。

---

## 📂 项目结构

```
vane-lazy-image/
├── src/
│   ├── components/
│   │   └── LazyLoadImagePlugin/
│   │       ├── core/
│   │       │   └── LazyLoadImageCore.tsx    # 核心组件
│   │       ├── plugins/
│   │       │   ├── types.ts                 # 插件类型定义
│   │       │   ├── PluginBus.ts             # 事件总线
│   │       │   ├── PluginManager.ts         # 插件管理器
│   │       │   ├── withPlugins.tsx          # HOC 组合方法
│   │       │   ├── FetchLoaderPlugin.ts     # Fetch 加载器
│   │       │   └── index.ts                 # 插件系统导出
│   │       ├── custom-plugins/              # 60+ 自定义插件
│   │       │   ├── WatermarkPlugin/
│   │       │   ├── FadeInPlugin/
│   │       │   ├── RetryOnErrorPlugin/
│   │       │   └── ...
│   │       └── index.ts                     # 统一导出
│   ├── pages/
│   │   └── LazyLoadImagePlugin/
│   │       ├── _layout/
│   │       │   └── DemoPage.tsx             # 演示页面布局
│   │       ├── Home.tsx                     # 首页
│   │       ├── WatermarkDemo.tsx            # 各插件演示页面
│   │       └── ...                          # 60+ 演示文件
│   ├── App.tsx                              # 应用入口
│   ├── App.css                              # 全局样式
│   └── main.tsx                             # React 入口
├── dist/                                    # 构建产物
├── public/                                  # 静态资源
├── vite.config.ts                           # Vite 配置
├── tsconfig.json                            # TypeScript 配置
├── package.json                             # 项目配置
└── README.md                                # 项目文档
```

---

## 🎯 API 文档

### 核心组件：`LazyLoadImageCore`

#### Props

| 属性                 | 类型                  | 默认值   | 说明         |
| -------------------- | --------------------- | -------- | ------------ |
| `src`                | `string`              | **必填** | 图片 URL     |
| `alt`                | `string`              | `""`     | 替代文本     |
| `loading`            | `"lazy" \| "eager"`   | `"lazy"` | 加载策略     |
| `rootMargin`         | `string`              | `"0px"`  | 视口边距     |
| `threshold`          | `number \| number[]`  | `0.01`   | 可见度阈值   |
| `containerStyle`     | `React.CSSProperties` | `{}`     | 容器样式     |
| `imageStyle`         | `React.CSSProperties` | `{}`     | 图片样式     |
| `containerClassName` | `string`              | `""`     | 容器类名     |
| `imageClassName`     | `string`              | `""`     | 图片类名     |
| `onLoad`             | `() => void`          | -        | 加载完成回调 |
| `onError`            | `() => void`          | -        | 加载失败回调 |

### HOC：`withPlugins`

```tsx
function withPlugins<P extends CoreImageProps>(
  Component: React.ComponentType<P>,
  plugins: Plugin[]
): React.FC<P>;
```

#### 参数

- `Component`：核心组件（通常是 `LazyLoadImageCore`）
- `plugins`：插件数组

#### 返回值

增强后的 React 组件

### 插件类型定义

#### 核心插件接口

```typescript
interface LazyImagePlugin {
  name: string;
  version?: string;
  hooks: PluginHooks;
  config?: Record<string, any>;
  init?: () => void | Promise<void>;
  destroy?: () => void | Promise<void>;
}
```

#### 插件上下文

```typescript
interface PluginContext {
  // 基础属性
  src: string;
  imageState: UseImageStateReturnLike;
  containerRef: React.RefObject<HTMLElement | null>;
  imageRef?: React.RefObject<HTMLImageElement | null>;
  isIntersecting: boolean;
  props: LazyLoadImageCoreProps;
  bus?: PluginBus;

  // 扩展上下文
  networkInfo?: NetworkInfo;
  deviceInfo?: DeviceInfo;
  dimensions?: {
    width: number;
    height: number;
    naturalWidth?: number;
    naturalHeight?: number;
  };
  performanceData?: {
    loadStartTime: number;
    loadEndTime?: number;
    duration?: number;
    size?: number;
  };
  sharedData?: Map<string, any>;
}

interface UseImageStateReturnLike {
  isIdle: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
}
```

#### 插件钩子

```typescript
interface PluginHooks {
  // 生命周期钩子
  onMount?: (context: PluginContext) => void | (() => void);
  onUnmount?: (context: PluginContext) => void;

  // 加载流程钩子
  onBeforeLoad?: (context: PluginContext) => boolean | Promise<boolean>;
  onLoad?: (
    context: PluginContext
  ) => string | Promise<string | undefined> | undefined;
  onLoadSuccess?: (
    context: PluginContext,
    displaySrc: string
  ) => void | Promise<void>;
  onLoadError?: (
    context: PluginContext,
    error: Error
  ) => boolean | Promise<boolean>;

  // 视口钩子
  onEnterViewport?: (context: PluginContext) => void;
  onLeaveViewport?: (context: PluginContext) => void;
  onVisibilityChange?: (context: PluginContext, isVisible: boolean) => void;

  // 进度与重试
  onProgress?: (context: PluginContext, progress: ProgressInfo) => void;
  onRetry?: (
    context: PluginContext,
    retryCount: number,
    maxRetries: number
  ) => void;

  // 状态变化钩子
  onSrcChange?: (
    context: PluginContext,
    oldSrc: string,
    newSrc: string
  ) => void;
  onNetworkChange?: (context: PluginContext, networkInfo: NetworkInfo) => void;
  onResize?: (context: PluginContext, dimensions: Dimensions) => void;

  // 交互钩子
  onInteraction?: (
    context: PluginContext,
    interactionType: InteractionType
  ) => void;

  // 其他钩子
  onAbort?: (context: PluginContext) => void;
  onDecode?: (context: PluginContext) => void;
  onPaint?: (context: PluginContext) => void;

  // 渲染钩子
  render?: (context: PluginContext) => React.ReactNode;
  renderOverlay?: (context: PluginContext) => React.ReactNode;

  // Props 转换
  transformProps?: (props: LazyLoadImageCoreProps) => LazyLoadImageCoreProps;
}
```

#### 辅助类型

```typescript
// 进度信息
interface ProgressInfo {
  loaded: number;
  total: number;
  percent: number; // 0~100
  indeterminate?: boolean; // 当无法获取总大小时为 true
}

// 网络信息
interface NetworkInfo {
  effectiveType: "4g" | "3g" | "2g" | "slow-2g";
  downlink: number; // Mbps
  rtt: number; // ms
  saveData: boolean;
}

// 设备信息
interface DeviceInfo {
  type: "mobile" | "tablet" | "desktop";
  os: string;
  browser: string;
  devicePixelRatio: number;
  viewportWidth: number;
  viewportHeight: number;
}

// 尺寸信息
interface Dimensions {
  width: number;
  height: number;
}

// 交互类型
type InteractionType = "click" | "hover" | "focus" | "touch";
```

#### 插件通信总线

```typescript
interface PluginBus {
  emit: (event: string, data: any) => void;
  on: (event: string, handler: (data: any) => void) => () => void;
  getData: (key: string) => any;
  setData: (key: string, value: any) => void;
}
```

#### 插件管理器

```typescript
interface PluginManager {
  register: (plugin: LazyImagePlugin) => void;
  unregister: (pluginName: string) => void;
  getPlugin: (pluginName: string) => LazyImagePlugin | undefined;
  getAllPlugins: () => LazyImagePlugin[];
  executeHook: <K extends keyof PluginHooks>(
    hookName: K,
    context: PluginContext,
    ...args: any[]
  ) => Promise<any>;
}
```

---

## 🔨 自定义插件开发

创建自定义插件非常简单，只需实现 `LazyImagePlugin` 接口：

### 基础插件示例

```tsx
import type { LazyImagePlugin } from "vane-lazy-image";

interface MyPluginOptions {
  message?: string;
  showOverlay?: boolean;
}

export function createMyCustomPlugin(
  options: MyPluginOptions = {}
): LazyImagePlugin {
  const { message = "自定义插件", showOverlay = true } = options;

  return {
    name: "my-custom-plugin",
    version: "1.0.0",
    config: options,

    // 插件初始化
    init: async () => {
      console.log(`${message} 初始化`);
    },

    // 插件销毁
    destroy: async () => {
      console.log(`${message} 销毁`);
    },

    // 插件钩子
    hooks: {
      // 组件挂载时
      onMount: (context) => {
        console.log("组件挂载", context.src);

        // 返回清理函数（可选）
        return () => {
          console.log("组件卸载清理");
        };
      },

      // 加载前检查
      onBeforeLoad: (context) => {
        console.log("准备加载", context.src);
        // 返回 false 可以阻止加载
        return true;
      },

      // 修改图片源
      onLoad: (context) => {
        // 可以返回修改后的 src
        return context.src + "?custom=param";
      },

      // 加载成功
      onLoadSuccess: (context, displaySrc) => {
        console.log("加载成功", displaySrc);
      },

      // 加载失败
      onLoadError: (context, error) => {
        console.error("加载失败", error);
        // 返回 true 表示已处理错误
        return true;
      },

      // 进入视口
      onEnterViewport: (context) => {
        console.log("进入视口");
      },

      // 离开视口
      onLeaveViewport: (context) => {
        console.log("离开视口");
      },

      // 加载进度
      onProgress: (context, progress) => {
        console.log(`加载进度: ${progress.percent}%`);
      },

      // 渲染覆盖层
      renderOverlay: (context) => {
        if (!showOverlay) return null;

        return (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0, 0, 0, 0.5)",
              color: "white",
              pointerEvents: "none",
            }}
          >
            {message}
          </div>
        );
      },
    },
  };
}
```

### 高级插件示例：带状态管理

```tsx
import { useState } from "react";
import type { LazyImagePlugin, PluginContext } from "vane-lazy-image";

interface AdvancedPluginOptions {
  enableCache?: boolean;
  timeout?: number;
}

export function createAdvancedPlugin(
  options: AdvancedPluginOptions = {}
): LazyImagePlugin {
  const { enableCache = true, timeout = 5000 } = options;
  const cache = new Map<string, string>();

  return {
    name: "advanced-plugin",
    version: "1.0.0",

    hooks: {
      onMount: (context) => {
        // 使用插件总线进行通信
        const unsubscribe = context.bus?.on("custom-event", (data) => {
          console.log("收到自定义事件", data);
        });

        // 设置共享数据
        context.sharedData?.set("startTime", Date.now());

        return () => {
          unsubscribe?.();
        };
      },

      onLoad: async (context) => {
        // 检查缓存
        if (enableCache && cache.has(context.src)) {
          return cache.get(context.src);
        }

        // 添加超时控制
        return new Promise((resolve) => {
          const timer = setTimeout(() => {
            resolve(context.src);
          }, timeout);

          // 清理定时器
          context.bus?.on("abort", () => {
            clearTimeout(timer);
          });
        });
      },

      onLoadSuccess: (context, displaySrc) => {
        // 缓存成功的图片
        if (enableCache) {
          cache.set(context.src, displaySrc);
        }

        // 发送自定义事件
        context.bus?.emit("load-complete", {
          src: context.src,
          duration: Date.now() - (context.sharedData?.get("startTime") || 0),
        });
      },

      onNetworkChange: (context, networkInfo) => {
        console.log("网络状态变化", networkInfo);

        // 根据网络状态调整策略
        if (networkInfo.saveData) {
          console.log("开启省流模式");
        }
      },

      renderOverlay: (context) => {
        const { isLoading, isError } = context.imageState;

        if (isLoading) {
          return <div>加载中...</div>;
        }

        if (isError) {
          return <div>加载失败</div>;
        }

        return null;
      },
    },
  };
}
```

### 插件开发最佳实践

#### 1. 命名规范

```tsx
// ✅ 好的命名
export function createWatermarkPlugin(options) { ... }
export function createRetryOnErrorPlugin(options) { ... }

// ❌ 避免的命名
export function watermark(options) { ... }
export function plugin(options) { ... }
```

#### 2. 钩子优先级

钩子按优先级分类：

- **高优先级**：`onProgress`, `onRetry`, `onSrcChange`, `onNetworkChange`
- **中优先级**：`onVisibilityChange`, `onResize`, `onInteraction`, `onAbort`
- **低优先级**：`onDecode`, `onPaint`

#### 3. 错误处理

```tsx
hooks: {
  onLoadError: (context, error) => {
    try {
      // 处理错误
      console.error("插件错误", error);

      // 返回 true 表示已处理
      return true;
    } catch (e) {
      // 避免插件错误影响其他插件
      console.warn("错误处理失败", e);
      return false;
    }
  },
}
```

#### 4. 清理资源

```tsx
hooks: {
  onMount: (context) => {
    const timer = setInterval(() => {
      // 定期任务
    }, 1000);

    // 返回清理函数
    return () => {
      clearInterval(timer);
    };
  },
}
```

#### 5. 使用插件总线

```tsx
hooks: {
  onMount: (context) => {
    // 订阅事件
    const unsubscribe = context.bus?.on("custom-event", (data) => {
      console.log(data);
    });

    // 发送事件
    context.bus?.emit("plugin-ready", { name: "my-plugin" });

    // 共享数据
    context.bus?.setData("myKey", "myValue");

    return unsubscribe;
  },
}
```

---

## 💡 使用技巧

### 1. 组合多个视觉效果

```tsx
const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createSkeletonPlugin({ type: "shimmer" }),
  createBlurUpPlugin({ duration: 400 }),
  createFadeInPlugin({ duration: 600 }),
  createWatermarkPlugin({ text: "VANE" }),
]);
```

### 2. 性能优化最佳实践

```tsx
const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createPreconnectPlugin({ domains: ["https://cdn.example.com"] }),
  createMemoryCachePlugin({ maxSize: 50 }),
  createConcurrencyControlPlugin({ maxConcurrent: 4 }),
  createImageOptimizationPlugin({ defaultQuality: 80 }),
]);
```

### 3. 错误处理完整方案

```tsx
const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createRetryOnErrorPlugin({ maxRetries: 3 }),
  createCDNFallbackPlugin({ fallbackUrls: ["https://backup.cdn.com"] }),
  createFallbackImagePlugin({ fallbackSrc: "/404.jpg" }),
  createErrorOverlayPlugin({ showRetryButton: true }),
]);
```

---

## ❓ 常见问题

### Q: "Loading..." 文本没有居中？

**A:** 确保容器使用了正确的定位方式。推荐使用绝对定位 + Flexbox：

```tsx
containerStyle={{
  position: "relative",
  width: "100%",
  height: "100%",
}}
```

覆盖层样式：

```css
position: absolute;
inset: 0;
display: flex;
align-items: center;
justify-content: center;
```

### Q: 悬停预取不生效？

**A:** 检查以下几点：

1. 确保设备支持 `mouseenter` 事件（触屏设备需要使用 `touchstart`）
2. 检查覆盖层是否设置了 `pointerEvents: "none"`
3. 确认网络面板中是否有预取请求

### Q: 进度条不显示？

**A:** 资源可能被缓存。解决方法：

1. 打开浏览器开发者工具
2. 在 Network 面板禁用缓存
3. 或者使用网络限速功能模拟慢速网络

### Q: 如何调试插件？

**A:** 使用 `createEventLoggerPlugin`：

```tsx
const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createEventLoggerPlugin(),
  // 其他插件...
]);
```

### Q: 如何在生产环境中使用？

**A:** 安装 npm 包后直接导入：

```tsx
import {
  LazyLoadImageCore,
  withPlugins,
  createWatermarkPlugin,
} from "vane-lazy-image";
```

### Q: TypeScript 类型报错？

**A:** 确保安装了类型定义，或者临时使用 `as any`：

```tsx
const LazyImage = withPlugins(LazyLoadImageCore as any, plugins);
```

---

## 🌐 浏览器支持

| 浏览器  | 版本 |
| ------- | ---- |
| Chrome  | ≥ 88 |
| Firefox | ≥ 85 |
| Safari  | ≥ 14 |
| Edge    | ≥ 88 |

> 对于不支持 `IntersectionObserver` 的老旧浏览器，组件会自动降级为立即加载模式。

---

## 🛠️ 技术栈

- **框架**：React 18+
- **语言**：TypeScript 5+
- **构建工具**：Vite 5+
- **样式**：CSS-in-JS（内联样式）
- **代码高亮**：react-syntax-highlighter

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m "Add some feature"`
4. 推送到分支：`git push origin feature/your-feature`
5. 提交 Pull Request

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 TypeScript 严格模式
- 保持代码简洁、可读
- 为新功能添加测试和文档

---

## 📄 许可证

[MIT License](./LICENSE) © 2025 Frank Vane

---

## 🔗 相关链接

- [GitHub 仓库](https://github.com/frankvane/vane-lazy-image)
- [NPM 包](https://www.npmjs.com/package/vane-lazy-image)
- [在线演示](https://chinavane.netlify.app/)
- [问题反馈](https://github.com/frankvane/vane-lazy-image/issues)
- [更新日志](./CHANGELOG.md)

---

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

如果这个项目对您有帮助，欢迎 ⭐ Star 支持！

---

Made with ❤️ by Frank Vane
