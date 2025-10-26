import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = command === "serve";
  const isLib = mode === "lib" || process.env.BUILD_TARGET === "lib";

  // 基础插件配置
  const plugins = [react()];

  // 只在库构建时添加 dts 插件
  if (isLib) {
    plugins.push(
      dts({
        include: ["src/components/LazyLoadImagePlugin/**/*"],
        outDir: "dist",
        // Windows 下 rollup 打包类型文件可能触发 EPERM（文件占用/权限），关闭以避免写入后清理目录失败
        rollupTypes: false,
        tsconfigPath: "./tsconfig.app.json",
        staticImport: true,
        insertTypesEntry: true,
      }) as any
    );
  }

  // 开发模式配置
  if (isDev) {
    return {
      plugins,
      resolve: {
        alias: {
          // 将 vane-lazy-image 包导入指向本地源码
          "vane-lazy-image/core": "/src/components/LazyLoadImagePlugin/entries/core/index.ts",
          "vane-lazy-image/plugins": "/src/components/LazyLoadImagePlugin/entries/plugins/index.ts",
          "vane-lazy-image/advanced": "/src/components/LazyLoadImagePlugin/entries/advanced/index.ts",
          "vane-lazy-image/monitoring": "/src/components/LazyLoadImagePlugin/entries/monitoring/index.ts",
          "vane-lazy-image/custom-plugins": "/src/components/LazyLoadImagePlugin/custom-plugins/index.ts",
          "vane-lazy-image": "/src/components/LazyLoadImagePlugin/index.ts",
        },
      },
      server: {
        port: 3000,
        open: true,
      },
      // 开发时不需要 esbuild 优化
      esbuild: false,
    };
  }

  // 库构建模式配置
  if (isLib) {
    // 方案 B + C: 多入口构建配置
    const entries = {
      index: "./src/components/LazyLoadImagePlugin/index.ts",          // 完整包
      core: "./src/components/LazyLoadImagePlugin/entries/core/index.ts",
      plugins: "./src/components/LazyLoadImagePlugin/entries/plugins/index.ts",
      advanced: "./src/components/LazyLoadImagePlugin/entries/advanced/index.ts",
      monitoring: "./src/components/LazyLoadImagePlugin/entries/monitoring/index.ts",
      // 自定义插件统一入口（支持 tree-shaking 按需引入）
      "custom-plugins": "./src/components/LazyLoadImagePlugin/custom-plugins/index.ts",
    };

    return {
      plugins,
      // 方案 C: 定义全局常量，在构建时替换
      define: {
        __DEV__: false, // 生产环境禁用调试代码
        "process.env.NODE_ENV": JSON.stringify("production"),
      },
      esbuild: {
        drop: ["console", "debugger"],  // 方案 C: 移除所有 console 和 debugger
      },
      build: {
        minify: "esbuild",
        target: "es2015",
        sourcemap: false,
        lib: {
          entry: entries,
          name: "LazyLoadImagePlugin",
          formats: ["es"],
        },
        rollupOptions: {
          output: {
            format: "es",
            dir: "dist",
            entryFileNames: (chunkInfo) => {
              return `${chunkInfo.name}.js`;
            },
            chunkFileNames: "[name]-[hash].js",
            minifyInternalExports: true,
            compact: true,
            generatedCode: {
              constBindings: true,
              objectShorthand: true,
              symbols: true,
            },
            // 强制每个模块独立打包，不共享代码
            // 虽然会有一些代码重复，但确保可以独立使用
            manualChunks: () => {
              return undefined; // 返回 undefined 禁止拆分
            },
          },
          external: ["react", "react-dom"],
          treeshake: {
            moduleSideEffects: false,
            propertyReadSideEffects: false,
            tryCatchDeoptimization: false,
          },
          // 每个入口独立打包
          preserveEntrySignatures: "exports-only",
        },
      },
    };
  }

  // 默认应用构建模式（用于演示页面）
  return {
    plugins,
    resolve: {
      alias: {
        // 将 vane-lazy-image 包导入指向本地源码（子路径要放在前面）
        "vane-lazy-image/core": "/src/components/LazyLoadImagePlugin/entries/core/index.ts",
        "vane-lazy-image/plugins": "/src/components/LazyLoadImagePlugin/entries/plugins/index.ts",
        "vane-lazy-image/advanced": "/src/components/LazyLoadImagePlugin/entries/advanced/index.ts",
        "vane-lazy-image/monitoring": "/src/components/LazyLoadImagePlugin/entries/monitoring/index.ts",
        "vane-lazy-image/custom-plugins": "/src/components/LazyLoadImagePlugin/custom-plugins/index.ts",
        "vane-lazy-image": "/src/components/LazyLoadImagePlugin/index.ts",
      },
    },
    base: "./",
    build: {
      outDir: "vane-lazy-image",
      rollupOptions: {
        input: "./index.html",
      },
    },
  };
});
