import type {
  LazyImagePlugin,
  PluginContext,
  PluginHooks,
  PluginManager,
} from "./types";

export function createPluginManager(): PluginManager {
  const plugins = new Map<string, LazyImagePlugin>();

  const register = (plugin: LazyImagePlugin) => {
    plugins.set(plugin.name, plugin);
    if (plugin.init) {
      Promise.resolve(plugin.init()).catch((error) => {
        console.warn(`[PluginManager] init failed for ${plugin.name}`, error);
      });
    }
  };

  const unregister = (pluginName: string) => {
    const plugin = plugins.get(pluginName);
    if (!plugin) return;
    if (plugin.destroy) {
      Promise.resolve(plugin.destroy()).catch((error) => {
        console.warn(`[PluginManager] destroy failed for ${plugin.name}`, error);
      });
    }
    plugins.delete(pluginName);
  };

  const getPlugin = (pluginName: string): LazyImagePlugin | undefined =>
    plugins.get(pluginName);

  const getAllPlugins = (): LazyImagePlugin[] => Array.from(plugins.values());

  const executeHook = async <K extends keyof PluginHooks>(
    hookName: K,
    context: PluginContext,
    ...args: any[]
  ): Promise<any> => {
    const list = Array.from(plugins.values());
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
          `[PluginManager] hook ${String(hookName)} failed in ${plugin.name}`,
          error
        );
      }
    }
    return undefined;
  };

  return { register, unregister, getPlugin, getAllPlugins, executeHook };
}