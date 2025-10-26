/**
 * 方案 C: 全局环境变量类型定义
 * 用于条件编译和调试代码移除
 */

declare const __DEV__: boolean;

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
  }
}

