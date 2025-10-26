import type { ListenerInfo, PluginBus, PluginBusConfig, PluginBusEvents, TypedPluginBus } from "./types";

/**
 * 创建插件总线
 * @param config - Issue #25: 配置选项
 * @returns 插件总线实例
 */
export function createPluginBus(config: PluginBusConfig = {}): PluginBus {
  const {
    debug = false,
    warnUncleared = false,
    batchEvents: customBatchEvents,
  } = config;

  const handlers = new Map<string, Set<(data: any) => void>>();
  // Issue #12: 通配符处理器存储
  const wildcardHandlers = new Map<string, Set<(data: any) => void>>();
  const store = new Map<string, any>();

  // Issue #25: 调试模式 - 使用 WeakMap 跟踪监听器来源
  const handlerSources = debug ? new WeakMap<(data: any) => void, string>() : null;

  // Issue #13: 事件批处理相关
  const eventQueue = new Map<string, any[]>();
  let rafId: number | null = null;
  // 需要批处理的高频事件（Issue #25: 可配置）
  const batchEvents = customBatchEvents || new Set(["progress", "scroll", "resize"]);

  // Issue #12: 匹配通配符
  const matchWildcard = (pattern: string, event: string): boolean => {
    const regex = new RegExp(
      "^" + pattern.replace(/\*/g, ".*").replace(/\?/g, ".") + "$"
    );
    return regex.test(event);
  };

  // Issue #13: 触发处理器（内部方法）
  const triggerHandlers = (event: string, data: any) => {
    // 触发精确匹配的处理器
    const set = handlers.get(event);
    if (set) {
      for (const h of set) {
        try {
          h(data);
        } catch (e) {
          console.warn(`[PluginBus] handler error for event "${event}"`, e);
        }
      }
    }

    // Issue #12: 触发通配符匹配的处理器
    for (const [pattern, handlers] of wildcardHandlers.entries()) {
      if (matchWildcard(pattern, event)) {
        for (const h of handlers) {
          try {
            h(data);
          } catch (e) {
            console.warn(`[PluginBus] wildcard handler error for pattern "${pattern}"`, e);
          }
        }
      }
    }
  };

  // Issue #13: 批量刷新事件队列
  const flush = () => {
    eventQueue.forEach((dataList, event) => {
      // 保留最新数据（合并策略）
      const latestData = dataList[dataList.length - 1];
      triggerHandlers(event, latestData);
    });
    eventQueue.clear();
    rafId = null;
  };

  const emit = (event: string, data: any) => {
    // Issue #13: 判断是否需要批处理
    if (batchEvents.has(event)) {
      // 加入队列
      if (!eventQueue.has(event)) {
        eventQueue.set(event, []);
      }
      eventQueue.get(event)!.push(data);

      // 调度批量触发（使用 requestAnimationFrame）
      if (!rafId) {
        rafId = requestAnimationFrame(flush) as any;
      }
    } else {
      // 立即触发
      triggerHandlers(event, data);
    }
  };

  const on = (event: string, handler: (data: any) => void) => {
    // Issue #25: 调试模式 - 捕获注册来源
    if (handlerSources && debug) {
      try {
        const stack = new Error().stack;
        const source = stack
          ?.split('\n')[3] // 获取调用者的栈帧
          ?.trim()
          .replace(/^at\s+/, '') || 'unknown';
        handlerSources.set(handler, source);
      } catch (e) {
        // 忽略错误
      }
    }

    // Issue #12: 判断是否为通配符事件
    const isWildcard = event.includes("*") || event.includes("?");

    if (isWildcard) {
      // 通配符处理器
      let set = wildcardHandlers.get(event);
      if (!set) {
        set = new Set();
        wildcardHandlers.set(event, set);
      }
      set.add(handler);
      return () => {
        set?.delete(handler);
        if (set?.size === 0) {
          wildcardHandlers.delete(event);
        }
      };
    } else {
      // 普通处理器
      let set = handlers.get(event);
      if (!set) {
        set = new Set();
        handlers.set(event, set);
      }
      set.add(handler);
      return () => {
        set?.delete(handler);
        if (set?.size === 0) {
          handlers.delete(event);
        }
      };
    }
  };

  // Issue #12: 一次性监听
  const once = (event: string, handler: (data: any) => void) => {
    const wrapper = (data: any) => {
      try {
        handler(data);
      } finally {
        off();
      }
    };
    const off = on(event, wrapper);
    return off;
  };

  // Issue #12: 移除监听器
  const off = (event: string, handler?: (data: any) => void) => {
    if (!handler) {
      // 移除该事件的所有处理器
      handlers.delete(event);
      wildcardHandlers.delete(event);
    } else {
      // 移除特定处理器
      const set = handlers.get(event);
      if (set) {
        set.delete(handler);
        if (set.size === 0) {
          handlers.delete(event);
        }
      }

      const wildcardSet = wildcardHandlers.get(event);
      if (wildcardSet) {
        wildcardSet.delete(handler);
        if (wildcardSet.size === 0) {
          wildcardHandlers.delete(event);
        }
      }
    }
  };

  // Issue #12: 清空所有监听器
  const clear = (event?: string) => {
    if (event) {
      // 清空特定事件
      handlers.delete(event);
      wildcardHandlers.delete(event);
      // Issue #13: 同时清空队列
      eventQueue.delete(event);
    } else {
      // 清空所有事件
      handlers.clear();
      wildcardHandlers.clear();
      // Issue #13: 清空队列
      eventQueue.clear();
      // 取消待处理的批处理
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  };

  const getData = (key: string) => store.get(key);
  const setData = (key: string, value: any) => store.set(key, value);

  // Issue #25: 获取活跃监听器信息（调试用）
  const getActiveListeners = (): ListenerInfo[] => {
    const result: ListenerInfo[] = [];

    // 普通事件监听器
    handlers.forEach((handlerSet, event) => {
      const sources: string[] = [];
      if (handlerSources && debug) {
        handlerSet.forEach((h) => {
          const source = handlerSources.get(h);
          if (source) sources.push(source);
        });
      }
      result.push({
        event,
        count: handlerSet.size,
        isWildcard: false,
        sources: sources.length > 0 ? sources : undefined,
      });
    });

    // 通配符事件监听器
    wildcardHandlers.forEach((handlerSet, event) => {
      const sources: string[] = [];
      if (handlerSources && debug) {
        handlerSet.forEach((h) => {
          const source = handlerSources.get(h);
          if (source) sources.push(source);
        });
      }
      result.push({
        event,
        count: handlerSet.size,
        isWildcard: true,
        sources: sources.length > 0 ? sources : undefined,
      });
    });

    return result;
  };

  // Issue #25: 获取配置
  const getConfig = (): PluginBusConfig => ({
    debug,
    warnUncleared,
    batchEvents,
  });

  // Issue #25: 警告未清理的监听器
  if (warnUncleared && typeof window !== 'undefined') {
    // 在页面卸载前检查
    const checkUncleared = () => {
      const active = getActiveListeners();
      if (active.length > 0) {
        console.warn(
          `[PluginBus] ${active.length} event listener(s) not cleared:`,
          active
        );
      }
    };

    // 使用 beforeunload 事件（仅在浏览器环境）
    if (typeof window.addEventListener === 'function') {
      window.addEventListener('beforeunload', checkUncleared);
    }
  }

  return { emit, on, once, off, clear, getData, setData, getActiveListeners, getConfig };
}

/**
 * 创建类型安全的插件总线（Issue #19）
 * @template Events - 事件类型映射
 * @param config - Issue #25: 配置选项
 * @returns 类型安全的插件总线实例
 *
 * @example
 * ```typescript
 * // 基础用法
 * const bus = createTypedPluginBus<PluginBusEvents>();
 *
 * // Issue #25: 启用调试模式
 * const debugBus = createTypedPluginBus<PluginBusEvents>({
 *   debug: true,
 *   warnUncleared: true,
 * });
 *
 * // ✅ 类型安全：事件名称和数据类型都有提示
 * bus.emit('image:load', { src: '/img.jpg', timestamp: Date.now() });
 *
 * // ✅ 类型安全：handler 参数类型自动推导
 * bus.on('image:load', (data) => {
 *   console.log(data.src); // ✅ TypeScript 知道 data 有 src 属性
 * });
 *
 * // Issue #25: 获取活跃监听器
 * const listeners = debugBus.getActiveListeners?.();
 * console.log('Active listeners:', listeners);
 * ```
 */
export function createTypedPluginBus<Events extends Record<string, any> = PluginBusEvents>(
  config?: PluginBusConfig
): TypedPluginBus<Events> {
  // 复用现有的 createPluginBus 实现
  const bus = createPluginBus(config);

  // 类型断言为 TypedPluginBus，运行时行为相同，但提供类型安全
  return bus as unknown as TypedPluginBus<Events>;
}
