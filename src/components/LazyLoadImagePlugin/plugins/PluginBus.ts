import type { PluginBus } from "./types";

export function createPluginBus(): PluginBus {
  const handlers = new Map<string, Set<(data: any) => void>>();
  const store = new Map<string, any>();

  const emit = (event: string, data: any) => {
    const set = handlers.get(event);
    if (!set) return;
    for (const h of set) {
      try {
        h(data);
      } catch (e) {
        // 忽略单个处理器错误，避免中断事件传播
        console.warn(`[PluginBus] handler error for event "${event}"`, e);
      }
    }
  };

  const on = (event: string, handler: (data: any) => void) => {
    let set = handlers.get(event);
    if (!set) {
      set = new Set();
      handlers.set(event, set);
    }
    set.add(handler);
    return () => {
      set?.delete(handler);
    };
  };

  const getData = (key: string) => store.get(key);
  const setData = (key: string, value: any) => store.set(key, value);

  return { emit, on, getData, setData };
}