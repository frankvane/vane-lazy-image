/**
 * Issue #29: 插件沙箱机制
 *
 * 为插件提供隔离的执行环境，防止：
 * 1. 插件之间相互干扰
 * 2. 插件访问不应访问的数据
 * 3. 插件执行超时或死循环
 * 4. 内存泄漏（自动清理监听器）
 */

import type { PluginBus, PluginContext } from "./types";

/**
 * 沙箱配置
 */
export interface SandboxConfig {
  /** 插件名称（用于命名空间） */
  pluginName: string;

  /** 是否启用沙箱（默认 true） */
  enabled?: boolean;

  /** 钩子执行超时（毫秒，0 表示无限制） */
  hookTimeout?: number;

  /** 是否自动清理监听器（默认 true） */
  autoCleanup?: boolean;

  /** 是否启用调试模式 */
  debug?: boolean;
}

/**
 * 沙箱化的插件上下文
 */
export interface SandboxedContext extends PluginContext {
  /** 原始上下文（仅用于内部） */
  __originalContext?: PluginContext;

  /** 沙箱清理函数 */
  __cleanup?: () => void;
}

/**
 * 沙箱化的事件总线
 */
interface SandboxedBus extends PluginBus {
  /** 追踪该插件注册的监听器 */
  __listeners?: Array<() => void>;
}

/**
 * 创建插件沙箱
 *
 * @param context - 原始插件上下文
 * @param config - 沙箱配置
 * @returns 沙箱化的上下文
 */
export function createPluginSandbox(
  context: PluginContext,
  config: SandboxConfig
): SandboxedContext {
  const {
    pluginName,
    enabled = true,
    hookTimeout = 5000, // 默认 5 秒超时
    autoCleanup = true,
    debug = false,
  } = config;

  // 如果未启用沙箱，直接返回原始上下文
  if (!enabled) {
    return context as SandboxedContext;
  }

  // 存储需要清理的资源
  const cleanupFunctions: Array<() => void> = [];

  // ========================================================================
  // 1. 沙箱化事件总线（命名空间 + 自动清理）
  // ========================================================================

  let sandboxedBus: SandboxedBus | undefined;

  if (context.bus) {
    const originalBus = context.bus;
    const listeners: Array<() => void> = [];

    sandboxedBus = {
      // 包装 emit：添加插件名称前缀（可选）
      emit: (event: string, data: any) => {
        try {
          originalBus.emit(event, data);
        } catch (error) {
          console.error(`[Sandbox:${pluginName}] emit error:`, error);
          throw error;
        }
      },

      // 包装 on：追踪监听器以便清理
      on: (event: string, handler: (data: any) => void) => {
        const wrappedHandler = (data: any) => {
          try {
            handler(data);
          } catch (error) {
            console.error(
              `[Sandbox:${pluginName}] handler error for event "${event}":`,
              error
            );
            // 不再传播错误，避免影响其他插件
          }
        };

        const unsubscribe = originalBus.on(event, wrappedHandler);

        if (autoCleanup) {
          listeners.push(unsubscribe);
        }

        return unsubscribe;
      },

      // 包装 once
      once: (event: string, handler: (data: any) => void) => {
        const wrappedHandler = (data: any) => {
          try {
            handler(data);
          } catch (error) {
            console.error(
              `[Sandbox:${pluginName}] once handler error for event "${event}":`,
              error
            );
          }
        };

        return originalBus.once!(event, wrappedHandler);
      },

      // 包装 off
      off: (event: string, handler?: (data: any) => void) => {
        originalBus.off?.(event, handler);
      },

      // 包装 clear
      clear: (event?: string) => {
        originalBus.clear?.(event);
      },

      // sharedData 命名空间隔离
      getData: (key: string) => {
        // 添加插件名称前缀，实现命名空间
        const namespacedKey = `${pluginName}:${key}`;
        return originalBus.getData(namespacedKey);
      },

      setData: (key: string, value: any) => {
        // 添加插件名称前缀，实现命名空间
        const namespacedKey = `${pluginName}:${key}`;
        originalBus.setData(namespacedKey, value);
      },

      // 调试方法（如果存在）
      getActiveListeners: originalBus.getActiveListeners,
      getConfig: originalBus.getConfig,

      // 内部：追踪的监听器
      __listeners: listeners,
    } as SandboxedBus;

    // 清理函数：移除所有监听器
    if (autoCleanup) {
      cleanupFunctions.push(() => {
        if (debug) {
          console.debug(
            `[Sandbox:${pluginName}] Cleaning up ${listeners.length} listener(s)`
          );
        }
        listeners.forEach((unsubscribe) => {
          try {
            unsubscribe();
          } catch (error) {
            // 忽略清理错误
          }
        });
        listeners.length = 0; // 清空数组
      });
    }
  }

  // ========================================================================
  // 2. 创建沙箱化的上下文
  // ========================================================================

  const sandboxedContext: SandboxedContext = {
    ...context,
    bus: sandboxedBus,

    // 保留原始上下文的引用（仅内部使用）
    __originalContext: context,

    // 清理函数
    __cleanup: () => {
      if (debug) {
        console.debug(`[Sandbox:${pluginName}] Running cleanup...`);
      }
      cleanupFunctions.forEach((fn) => {
        try {
          fn();
        } catch (error) {
          console.error(`[Sandbox:${pluginName}] Cleanup error:`, error);
        }
      });
    },
  };

  return sandboxedContext;
}

/**
 * 包装插件钩子函数，添加超时和错误处理
 *
 * @param hookFn - 原始钩子函数
 * @param config - 沙箱配置
 * @returns 包装后的钩子函数
 */
export function wrapPluginHook<T extends (...args: any[]) => any>(
  hookFn: T,
  config: SandboxConfig
): T {
  const { pluginName, hookTimeout = 5000, debug = false } = config;

  return (async (...args: any[]) => {
    try {
      // 如果没有设置超时，直接执行
      if (hookTimeout === 0) {
        return await Promise.resolve(hookFn(...args));
      }

      // 创建超时 Promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              `[Sandbox:${pluginName}] Hook execution timeout (${hookTimeout}ms)`
            )
          );
        }, hookTimeout);
      });

      // 竞速：钩子执行 vs 超时
      const result = await Promise.race([
        Promise.resolve(hookFn(...args)),
        timeoutPromise,
      ]);

      return result;
    } catch (error) {
      if (debug) {
        console.error(`[Sandbox:${pluginName}] Hook execution error:`, error);
      }
      // 不向上传播错误，避免影响其他插件
      return undefined;
    }
  }) as T;
}

/**
 * 清理沙箱资源
 *
 * @param context - 沙箱化的上下文
 */
export function cleanupSandbox(context: SandboxedContext): void {
  if (context.__cleanup) {
    context.__cleanup();
    delete context.__cleanup;
  }
}

/**
 * 批量清理多个沙箱
 *
 * @param contexts - 沙箱化的上下文数组
 */
export function cleanupSandboxes(contexts: SandboxedContext[]): void {
  contexts.forEach((context) => cleanupSandbox(context));
}

