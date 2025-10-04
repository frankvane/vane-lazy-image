# Custom Plugins 指南

此目录用于存放业务侧或演示用的自定义插件，实现时请遵循以下约定，确保后续维护与扩展成本最低。

## 导入与导出

- 统一通过桶式导出路径导入：`src/components/LazyLoadImagePlugin/plugins`
- 示例：

```ts
import { withPlugins, createWatermarkPlugin } from "../../components/LazyLoadImagePlugin/plugins";
```

- 所有自定义插件在本目录下按文件拆分，并在 `custom-plugins/index.ts` 中集中导出：

```ts
export * from "./WatermarkPlugin";
export * from "./BadgePlugin";
```

## 文件与命名

- 一个插件一个文件，文件名以 `*Plugin.tsx` 结尾，例如 `WatermarkPlugin.tsx`
- 插件工厂命名统一为 `createXxxPlugin`，例如：`createWatermarkPlugin`
- 插件 `name` 字段使用短横线风格：`"watermark"`、`"badge"`

## 插件结构

- 使用工厂函数返回 `LazyImagePlugin`：

```ts
export function createXxxPlugin(config: XxxConfig = {}): LazyImagePlugin {
  return {
    name: "xxx",
    version: "1.0.0",
    config,
    hooks: {
      onBeforeLoad: (context) => true,
      onLoad: async (context) => undefined,
      onLoadSuccess: (context, displaySrc) => {},
      onLoadError: (context, error) => false,
      onEnterViewport: (context) => {},
      onLeaveViewport: (context) => {},
      onMount: (context) => undefined,
      onUnmount: (context) => {},
      render: (context) => null,
    },
  };
}
```

## 展示条件建议

- 渲染型插件应遵循图片状态避免闪烁：

```tsx
render: (context) => {
  if (!context.imageState.isLoaded) return null;
  return <YourOverlay />;
}
```

## 使用示例

```tsx
import React from "react";
import { withPlugins, createWatermarkPlugin } from "../../components/LazyLoadImagePlugin/plugins";
import LazyLoadImageCore from "../../components/LazyLoadImagePlugin/core/LazyLoadImageCore";

const Image = withPlugins(LazyLoadImageCore as any, [
  createWatermarkPlugin({ text: "© 2024 Demo" }),
]);

export default function Example() {
  return <Image src="https://picsum.photos/800/600" alt="demo" />;
}
```

## 约定总结

- 统一导入路径：`plugins` 桶式导出
- 统一工厂命名：`createXxxPlugin`
- 统一导出：集中在 `custom-plugins/index.ts`
- 统一展示时机：`imageState.isLoaded` 后再渲染叠加层