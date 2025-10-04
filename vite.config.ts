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
    return {
      plugins,
      esbuild: {
        drop: ["console", "debugger"],
      },
      build: {
        minify: "esbuild",
        lib: {
          entry: "./src/components/LazyLoadImagePlugin/index.ts",
          name: "LazyLoadImagePlugin",
          fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
          output: [
            {
              format: "es",
              dir: "dist",
              entryFileNames: "index.es.js",
              // 关键：在输出配置中添加更多优化
              minifyInternalExports: true, // 压缩内部导出
              compact: true,
              generatedCode: {
                constBindings: true,
                objectShorthand: true,
                symbols: true,
              },
            },
            {
              format: "umd",
              dir: "dist",
              entryFileNames: "index.umd.js",
              name: "LazyLoadImagePlugin",
              globals: {
                react: "React",
                "react-dom": "ReactDOM",
                "react-router-dom": "ReactRouterDOM",
              },
            },
          ],
          external: ["react", "react-dom", "react-router-dom"],
        },
      },
    };
  }

  // 默认应用构建模式（用于演示页面）
  return {
    plugins,
    build: {
      outDir: "dist-app",
      rollupOptions: {
        input: "./index.html",
      },
    },
  };
});
