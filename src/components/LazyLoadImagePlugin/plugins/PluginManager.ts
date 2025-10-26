import type {
  HotReloadOptions,
  LazyImagePlugin,
  PluginContext,
  PluginHooks,
  PluginManager,
  PluginManagerConfig,
  PluginState,
} from "./types";

import { DependencyResolver } from "../utils/DependencyResolver";
import { LAZY_IMAGE_CORE_VERSION } from "../index";
import { isVersionInRange } from "../utils/versionCompare";

// Issue #6: 创建插件管理器，支持配置
export function createPluginManager(
  initialConfig?: PluginManagerConfig
): PluginManager {
  const plugins = new Map<string, LazyImagePlugin>();
  // Issue #17: 依赖解析器
  const dependencyResolver = new DependencyResolver();
  // Issue #28: 插件状态存储（用于热更新）
  const pluginStates = new Map<string, PluginState>();

  // Issue #6: 管理器配置（默认值）
  let config: PluginManagerConfig = {
    conflictStrategy: "warn",  // 默认策略：警告并替换
    enableDebug: false,
    ...initialConfig,
  };

  const register = (plugin: LazyImagePlugin): boolean => {
    // Issue #22: 版本兼容性检查
    if (plugin.minCoreVersion || plugin.maxCoreVersion) {
      const compatible = isVersionInRange(
        LAZY_IMAGE_CORE_VERSION,
        plugin.minCoreVersion,
        plugin.maxCoreVersion
      );

      if (!compatible) {
        const versionInfo = [
          plugin.minCoreVersion && `>=${plugin.minCoreVersion}`,
          plugin.maxCoreVersion && `<=${plugin.maxCoreVersion}`,
        ]
          .filter(Boolean)
          .join(", ");

        throw new Error(
          `[PluginManager] Plugin ${plugin.name}@${plugin.version || "0.0.0"} ` +
            `requires core version ${versionInfo}, ` +
            `but current core version is ${LAZY_IMAGE_CORE_VERSION}`
        );
      }

      if (config.enableDebug) {
        console.debug(
          `[PluginManager] Version check passed for ${plugin.name}: ` +
            `core ${LAZY_IMAGE_CORE_VERSION} is compatible`
        );
      }
    }

    // Issue #17: 依赖检查
    const registeredNames = new Set(plugins.keys());

    // 1. 检查必需依赖
    const depCheck = dependencyResolver.checkDependencies(
      plugin.name,
      registeredNames
    );

    if (!depCheck.satisfied) {
      const missing = depCheck.missing.join(", ");
      throw new Error(
        `[PluginManager] Cannot register ${plugin.name}: ` +
          `missing required dependencies: ${missing}`
      );
    }

    // 2. 警告缺失的可选依赖
    if (depCheck.optional.length > 0 && config.enableDebug) {
      console.warn(
        `[PluginManager] ${plugin.name}: ` +
          `missing optional dependencies: ${depCheck.optional.join(", ")}`
      );
    }

    // 3. 检查冲突
    const conflictCheck = dependencyResolver.checkConflicts(
      plugin.name,
      registeredNames
    );

    if (conflictCheck.hasConflict) {
      const conflicts = conflictCheck.conflicts.join(", ");
      throw new Error(
        `[PluginManager] Cannot register ${plugin.name}: ` +
          `conflicts with: ${conflicts}`
      );
    }

    // 4. 添加依赖信息到解析器
    dependencyResolver.addPlugin(
      plugin.name,
      plugin.dependencies,
      plugin.optionalDependencies,
      plugin.conflicts
    );

    // 5. 检测循环依赖
    const cycles = dependencyResolver.detectCycles();
    if (cycles.length > 0) {
      // 移除刚添加的依赖信息（回滚）
      dependencyResolver.removePlugin(plugin.name);
      const cycleStr = cycles.map((c) => c.join(" -> ")).join("; ");
      throw new Error(
        `[PluginManager] Circular dependency detected: ${cycleStr}`
      );
    }

    // 继续现有的冲突检测逻辑...
    // Issue #6: 检查是否已存在同名插件（冲突检测）
    if (plugins.has(plugin.name)) {
      const existing = plugins.get(plugin.name)!;

      // 如果版本相同且配置相同，忽略（幂等性）
      if (
        existing.version === plugin.version &&
        JSON.stringify(existing.config) === JSON.stringify(plugin.config)
      ) {
        if (config.enableDebug || process.env.NODE_ENV === "development") {
          console.warn(
            `[PluginManager] Plugin ${plugin.name}@${plugin.version} already registered, skipping`
          );
        }
        return false; // 返回 false 表示未注册（已存在）
      }

      // Issue #6: 根据冲突策略处理
      const strategy = config.conflictStrategy || "warn";
      const conflictMessage =
        `[PluginManager] Plugin ${plugin.name} conflict: ` +
        `${existing.version || "unknown"} -> ${plugin.version || "unknown"}`;

      switch (strategy) {
        case "error":
          // 抛出错误，阻止注册
          throw new Error(
            `${conflictMessage}. ` +
            `Conflict strategy is 'error', registration blocked.`
          );

        case "warn":
          // 警告并替换（默认行为）
          console.warn(`${conflictMessage}, replacing`);
          unregister(plugin.name);
          break;

        case "ignore":
          // 忽略新插件，保留旧插件
          if (config.enableDebug) {
            console.debug(
              `${conflictMessage}, ignoring new plugin (keeping existing)`
            );
          }
          return false; // 返回 false 表示未注册（忽略）

        case "override":
          // 静默替换，无警告
          if (config.enableDebug) {
            console.debug(`${conflictMessage}, silently replacing`);
          }
          unregister(plugin.name);
          break;

        default:
          console.warn(`${conflictMessage}, unknown strategy, using default (warn)`);
          unregister(plugin.name);
      }
    }

    // 注册新插件
    plugins.set(plugin.name, plugin);

    if (plugin.init) {
      Promise.resolve(plugin.init()).catch((error) => {
        console.warn(`[PluginManager] init failed for ${plugin.name}`, error);
      });
    }

    if (config.enableDebug) {
      console.debug(
        `[PluginManager] Registered: ${plugin.name}@${plugin.version || "0.0.0"}`
      );
    }

    return true; // 返回 true 表示注册成功
  };

  const unregister = (pluginName: string): boolean => {
    const plugin = plugins.get(pluginName);
    if (!plugin) return false; // 返回 false 表示插件不存在

    // Issue #17: 移除依赖信息
    dependencyResolver.removePlugin(pluginName);

    if (plugin.destroy) {
      Promise.resolve(plugin.destroy()).catch((error) => {
        console.warn(`[PluginManager] destroy failed for ${plugin.name}`, error);
      });
    }
    plugins.delete(pluginName);

    if (config.enableDebug) {
      console.debug(`[PluginManager] Unregistered: ${pluginName}`);
    }

    return true; // 返回 true 表示卸载成功
  };

  const getPlugin = (pluginName: string): LazyImagePlugin | undefined =>
    plugins.get(pluginName);

  const getAllPlugins = (): LazyImagePlugin[] => {
    // Issue #7: 按优先级排序（数字越小越优先）
    return Array.from(plugins.values()).sort((a, b) => {
      const priorityA = a.priority ?? 100;
      const priorityB = b.priority ?? 100;
      return priorityA - priorityB;
    });
  };

  // Issue #16: 定义可并行执行的钩子（无依赖关系）
  const PARALLEL_HOOKS = new Set<string>([
    'onLoadStart',
    'onLoadSuccess',
    'onLoadError',
    'onEnterViewport',
    'onLeaveViewport',
    'onMount',
    'onUnmount',
    'onProgress',
    'onSrcChange',
    'onNetworkChange',
    'onResize',
  ]);

  // Issue #16: 定义必须串行执行的钩子（有依赖关系或需要保证顺序）
  const SERIAL_HOOKS = new Set<string>([
    'onBeforeLoad',
    'onLoad',
    'render',
    'renderOverlay',
    'transformProps',
  ]);

  const executeHook = async <K extends keyof PluginHooks>(
    hookName: K,
    context: PluginContext,
    ...args: any[]
  ): Promise<any> => {
    // Issue #7: 使用排序后的插件列表（按优先级）
    const list = getAllPlugins();
    const hookNameStr = String(hookName);

    // Issue #16: 判断是否可并行执行
    if (PARALLEL_HOOKS.has(hookNameStr)) {
      // 并行执行所有插件的钩子
      const results = await Promise.allSettled(
        list.map(async (plugin) => {
          const hook = plugin.hooks[hookName];
          if (!hook) return undefined;

          try {
            // @ts-ignore dynamic dispatch
            return await Promise.resolve(hook(context, ...args));
          } catch (error) {
            console.warn(
              `[PluginManager] hook ${hookNameStr} failed in ${plugin.name}`,
              error
            );
            return undefined;
          }
        })
      );

      // 收集成功的结果
      const successResults = results
        .filter((r) => r.status === 'fulfilled')
        .map((r: any) => r.value)
        .filter((v) => v !== undefined && v !== true);

      // 并行钩子通常不返回值，或返回多个结果
      return successResults.length > 0 ? successResults : undefined;
    } else {
      // 串行执行（保持顺序，支持中断和替换）
      for (const plugin of list) {
        const hook = plugin.hooks[hookName];
        if (!hook) continue;
        try {
          // @ts-ignore dynamic dispatch
          const result = await Promise.resolve(hook(context, ...args));
          if (result === false) {
            // 返回 false 表示中止后续执行
            return false;
          }
          // 非 undefined 的返回值直接返回（用于 onLoad 等可替换型钩子）
          if (result !== undefined && result !== true) {
            return result;
          }
        } catch (error) {
          console.warn(
            `[PluginManager] hook ${hookNameStr} failed in ${plugin.name}`,
            error
          );
        }
      }
      return undefined;
    }
  };

  // Issue #6: 获取配置
  const getConfig = (): PluginManagerConfig => {
    return { ...config };
  };

  // Issue #6: 更新配置
  const setConfig = (newConfig: Partial<PluginManagerConfig>) => {
    config = { ...config, ...newConfig };
    if (config.enableDebug) {
      console.debug("[PluginManager] Config updated:", config);
    }
  };

  // Issue #28: 保存插件状态（用于热更新）
  const savePluginState = (pluginName: string, state: any) => {
    const plugin = plugins.get(pluginName);
    if (!plugin) {
      console.warn(`[PluginManager] Cannot save state: plugin ${pluginName} not found`);
      return;
    }

    pluginStates.set(pluginName, {
      data: state,
      version: plugin.version,
      timestamp: Date.now(),
    });

    if (config.enableDebug) {
      console.debug(`[PluginManager] State saved for ${pluginName}`);
    }
  };

  // Issue #28: 获取插件状态（用于热更新）
  const getPluginState = (pluginName: string): PluginState | undefined => {
    return pluginStates.get(pluginName);
  };

  // Issue #28: 热替换插件
  const hotReload = (
    oldPluginName: string,
    newPlugin: LazyImagePlugin<any>,
    options: HotReloadOptions = {}
  ) => {
    const {
      preserveState = true,
      migrateState,
      force = false,
    } = options;

    if (config.enableDebug) {
      console.debug(
        `[PluginManager] Hot reloading ${oldPluginName} → ${newPlugin.name}@${newPlugin.version || "0.0.0"}`
      );
    }

    // 1. 获取旧插件
    const oldPlugin = plugins.get(oldPluginName);
    if (!oldPlugin) {
      throw new Error(
        `[PluginManager] Cannot hot reload: plugin ${oldPluginName} not found`
      );
    }

    // 2. 保存旧插件的状态（如果需要）
    let savedState: PluginState | undefined;
    if (preserveState) {
      savedState = pluginStates.get(oldPluginName);
      if (config.enableDebug && savedState) {
        console.debug(
          `[PluginManager] Preserved state from ${oldPluginName} (version: ${savedState.version})`
        );
      }
    }

    // 3. 版本兼容性检查（可选强制跳过）
    if (!force && newPlugin.minCoreVersion || newPlugin.maxCoreVersion) {
      const compatible = isVersionInRange(
        LAZY_IMAGE_CORE_VERSION,
        newPlugin.minCoreVersion,
        newPlugin.maxCoreVersion
      );

      if (!compatible) {
        const versionInfo = [
          newPlugin.minCoreVersion && `>=${newPlugin.minCoreVersion}`,
          newPlugin.maxCoreVersion && `<=${newPlugin.maxCoreVersion}`,
        ]
          .filter(Boolean)
          .join(", ");

        throw new Error(
          `[PluginManager] Hot reload failed: ${newPlugin.name}@${newPlugin.version || "0.0.0"} ` +
            `requires core version ${versionInfo}, ` +
            `but current core version is ${LAZY_IMAGE_CORE_VERSION}. ` +
            `Use force: true to override.`
        );
      }
    }

    // 4. 卸载旧插件
    unregister(oldPluginName);

    // 5. 注册新插件
    try {
      register(newPlugin);
    } catch (error) {
      // 注册失败，回滚旧插件
      console.error(`[PluginManager] Hot reload failed, rolling back:`, error);
      register(oldPlugin);
      throw error;
    }

    // 6. 恢复状态（如果有）
    if (preserveState && savedState) {
      let restoredState = savedState.data;

      // 如果版本不同且提供了迁移函数，执行状态迁移
      if (
        migrateState &&
        savedState.version !== newPlugin.version &&
        savedState.version &&
        newPlugin.version
      ) {
        try {
          restoredState = migrateState(
            savedState.data,
            savedState.version,
            newPlugin.version
          );

          if (config.enableDebug) {
            console.debug(
              `[PluginManager] State migrated from ${savedState.version} → ${newPlugin.version}`
            );
          }
        } catch (error) {
          console.error(
            `[PluginManager] State migration failed for ${newPlugin.name}:`,
            error
          );
          // 继续使用原始状态
        }
      }

      // 保存恢复的状态
      pluginStates.set(newPlugin.name, {
        data: restoredState,
        version: newPlugin.version,
        timestamp: Date.now(),
      });

      if (config.enableDebug) {
        console.debug(`[PluginManager] State restored for ${newPlugin.name}`);
      }
    }

    if (config.enableDebug) {
      console.debug(`[PluginManager] Hot reload successful: ${newPlugin.name}`);
    }
  };

  return {
    register,
    unregister,
    getPlugin,
    getAllPlugins,
    executeHook,
    getConfig,
    setConfig,
    // Issue #28: 热更新 API
    savePluginState,
    getPluginState,
    hotReload,
  };
}