/**
 * Issue #4: 插件错误边界
 *
 * 为每个插件包裹 Error Boundary，防止单个插件错误影响整体功能
 */

import React, { Component, ErrorInfo, ReactNode } from "react";

interface PluginErrorBoundaryProps {
  children: ReactNode;
  pluginName: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface PluginErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class PluginErrorBoundary extends Component<
  PluginErrorBoundaryProps,
  PluginErrorBoundaryState
> {
  constructor(props: PluginErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): PluginErrorBoundaryState {
    // 更新状态以便下次渲染时显示降级 UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 记录错误到控制台（生产环境可以上报到错误监控服务）
    console.error(
      `[PluginErrorBoundary] Plugin "${this.props.pluginName}" encountered an error:`,
      error,
      errorInfo
    );

    // 调用可选的错误回调
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // 插件错误时不渲染任何内容，但不影响其他插件和核心功能
      // 也可以选择渲染一个错误提示，但这里选择静默失败
      if (process.env.NODE_ENV === "development") {
        // 开发环境下显示错误信息
        return (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              padding: "8px",
              background: "rgba(255, 0, 0, 0.1)",
              border: "1px solid rgba(255, 0, 0, 0.3)",
              color: "#d00",
              fontSize: "12px",
              zIndex: 9999,
            }}
          >
            <strong>Plugin Error: {this.props.pluginName}</strong>
            <br />
            {this.state.error?.message}
          </div>
        );
      }

      // 生产环境下静默失败，不渲染任何内容
      return null;
    }

    return this.props.children;
  }
}

export default PluginErrorBoundary;

