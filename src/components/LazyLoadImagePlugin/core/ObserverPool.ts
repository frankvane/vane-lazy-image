/**
 * 🚀 共享 IntersectionObserver 池 - 性能优化核心
 *
 * 避免每个图片组件创建独立的 Observer
 * 使用池模式，相同配置的 Observer 共享一个实例
 *
 * 性能收益：
 * - 100 张图片从 100 个 Observer 减少到 1-3 个（⬇️ 95% 实例数量）
 * - 显著提升滚动性能（减少回调执行次数）
 * - 减少浏览器内存占用（共享实例）
 * - 降低创建/销毁开销（复用实例）
 *
 * @version 2.0.0 - 增强版
 * @since v1.0.14
 */

/**
 * Observer 配置键（用于标识相同配置的 Observer）
 */
export interface ObserverConfig {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * 元素回调信息
 */
interface ElementCallback {
  element: Element;
  callback: (isIntersecting: boolean) => void;
  unobserveOnVisible?: boolean;
  addedAt: number; // 🆕 添加时间戳
}

/**
 * Observer 性能统计
 */
interface ObserverStats {
  key: string;
  elementCount: number;
  createdAt: number;
  lastUsedAt: number;
  totalCallbacks: number;
}

/**
 * 全局池统计信息（增强版）
 */
export interface PoolStats {
  observerCount: number;
  elementCount: number;
  averageElementsPerObserver: number;
  oldestObserver?: {
    key: string;
    age: number; // ms
  };
  newestObserver?: {
    key: string;
    age: number; // ms
  };
  mostUsedObserver?: {
    key: string;
    elementCount: number;
  };
  totalCallbackExecutions: number; // 🆕 总回调执行次数
  memoryEstimate: string; // 🆕 内存估算
}

/**
 * IntersectionObserver 池管理器（单例 + 增强版）
 */
class IntersectionObserverPool {
  private static instance: IntersectionObserverPool;

  // Observer 池：key = 配置序列化字符串，value = Observer 实例
  private observers = new Map<string, IntersectionObserver>();

  // 元素到 Observer key 的映射
  private elementToKey = new Map<Element, string>();

  // 每个 Observer 管理的元素回调
  private observerCallbacks = new Map<string, Set<ElementCallback>>();

  // 🆕 Observer 统计信息
  private observerStats = new Map<string, ObserverStats>();

  // 🆕 性能统计
  private totalCallbackExecutions = 0;

  // 🆕 调试模式
  private debugMode = false;

  // 🆕 自动清理定时器
  private cleanupTimer?: ReturnType<typeof setTimeout>;

  private constructor() {
    // 私有构造函数，防止外部实例化
    this.startAutoCleanup();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): IntersectionObserverPool {
    if (!IntersectionObserverPool.instance) {
      IntersectionObserverPool.instance = new IntersectionObserverPool();
    }
    return IntersectionObserverPool.instance;
  }

  /**
   * 🆕 启用/禁用调试模式
   */
  public setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
    if (enabled) {
      console.log("[ObserverPool] Debug mode enabled");
      console.log("[ObserverPool] Current stats:", this.getStats());
    }
  }

  /**
   * 🆕 启动自动清理（定期清理空闲的 Observer）
   */
  private startAutoCleanup(): void {
    if (typeof window === "undefined") return;

    // 每 60 秒检查一次
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      const IDLE_THRESHOLD = 60000; // 60 秒未使用则清理

      this.observerStats.forEach((stats, key) => {
        if (now - stats.lastUsedAt > IDLE_THRESHOLD && stats.elementCount === 0) {
          const observer = this.observers.get(key);
          if (observer) {
            observer.disconnect();
            this.observers.delete(key);
            this.observerCallbacks.delete(key);
            this.observerStats.delete(key);

            if (this.debugMode) {
              console.log(`[ObserverPool] Auto-cleaned idle observer: ${key}`);
            }
          }
        }
      });
    }, 60000);
  }

  /**
   * 🆕 停止自动清理
   */
  private stopAutoCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }

  /**
   * 生成 Observer 配置的唯一键
   */
  private getConfigKey(config: ObserverConfig): string {
    const { root, rootMargin = "0px", threshold = 0 } = config;
    // 使用 root 的标识 + rootMargin + threshold 生成唯一键
    const rootId = root ? `root-${root.tagName}-${root.className}` : "root-null";
    const thresholdStr = Array.isArray(threshold) ? threshold.join(",") : String(threshold);
    return `${rootId}|${rootMargin}|${thresholdStr}`;
  }

  /**
   * 观察元素
   */
  public observe(
    element: Element,
    callback: (isIntersecting: boolean) => void,
    config: ObserverConfig = {},
    unobserveOnVisible: boolean = false
  ): () => void {
    const key = this.getConfigKey(config);
    const now = Date.now();

    // 如果该配置的 Observer 不存在，则创建
    if (!this.observers.has(key)) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const callbacks = this.observerCallbacks.get(key);
            if (callbacks) {
              callbacks.forEach((cb) => {
                if (cb.element === entry.target) {
                  // 🆕 统计回调执行次数
                  this.totalCallbackExecutions++;
                  const stats = this.observerStats.get(key);
                  if (stats) {
                    stats.totalCallbacks++;
                    stats.lastUsedAt = Date.now();
                  }

                  cb.callback(entry.isIntersecting);

                  // 如果设置了 unobserveOnVisible 且元素可见，则取消观察
                  if (cb.unobserveOnVisible && entry.isIntersecting) {
                    this.unobserve(entry.target as Element);
                  }
                }
              });
            }
          });
        },
        {
          root: config.root || null,
          rootMargin: config.rootMargin || "0px",
          threshold: config.threshold ?? 0,
        }
      );

      this.observers.set(key, observer);
      this.observerCallbacks.set(key, new Set());

      // 🆕 初始化统计信息
      this.observerStats.set(key, {
        key,
        elementCount: 0,
        createdAt: now,
        lastUsedAt: now,
        totalCallbacks: 0,
      });

      if (this.debugMode) {
        console.log(`[ObserverPool] Created new observer for config: ${key}`);
      }
    }

    // 获取 Observer 并开始观察
    const observer = this.observers.get(key)!;
    const callbacks = this.observerCallbacks.get(key)!;

    // 添加元素回调
    const elementCallback: ElementCallback = {
      element,
      callback,
      unobserveOnVisible,
      addedAt: now,
    };
    callbacks.add(elementCallback);

    // 记录元素到 key 的映射
    this.elementToKey.set(element, key);

    // 🆕 更新统计
    const stats = this.observerStats.get(key);
    if (stats) {
      stats.elementCount++;
      stats.lastUsedAt = now;
    }

    // 开始观察
    observer.observe(element);

    if (this.debugMode) {
      console.log(`[ObserverPool] Observing element, total: ${this.elementToKey.size}`);
    }

    // 返回取消观察的函数
    return () => this.unobserve(element);
  }

  /**
   * 取消观察元素
   */
  public unobserve(element: Element): void {
    const key = this.elementToKey.get(element);
    if (!key) return;

    const observer = this.observers.get(key);
    const callbacks = this.observerCallbacks.get(key);

    if (observer && callbacks) {
      // 停止观察
      observer.unobserve(element);

      // 移除回调
      const toRemove = Array.from(callbacks).find((cb) => cb.element === element);
      if (toRemove) {
        callbacks.delete(toRemove);
      }

      // 清理映射
      this.elementToKey.delete(element);

      // 🆕 更新统计
      const stats = this.observerStats.get(key);
      if (stats) {
        stats.elementCount--;
        stats.lastUsedAt = Date.now();
      }

      // 如果该 Observer 没有观察任何元素了，可选择保留或销毁
      // 这里我们选择保留一段时间（由自动清理机制处理）
      if (callbacks.size === 0 && this.debugMode) {
        console.log(`[ObserverPool] Observer ${key} has no elements (will auto-clean later)`);
      }
    }
  }

  /**
   * 断开所有 Observer
   */
  public disconnectAll(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
    this.observerCallbacks.clear();
    this.elementToKey.clear();
    this.observerStats.clear();
    this.stopAutoCleanup();

    if (this.debugMode) {
      console.log("[ObserverPool] Disconnected all observers");
    }
  }

  /**
   * 获取当前池中 Observer 数量
   */
  public getObserverCount(): number {
    return this.observers.size;
  }

  /**
   * 获取当前观察的元素数量
   */
  public getElementCount(): number {
    return this.elementToKey.size;
  }

  /**
   * 🆕 获取详细统计信息（增强版）
   */
  public getStats(): PoolStats {
    const observerCount = this.observers.size;
    const elementCount = this.elementToKey.size;
    const averageElementsPerObserver = observerCount > 0 ? elementCount / observerCount : 0;

    const now = Date.now();
    let oldestObserver: { key: string; age: number } | undefined;
    let newestObserver: { key: string; age: number } | undefined;
    let mostUsedObserver: { key: string; elementCount: number } | undefined;

    this.observerStats.forEach((stats) => {
      const age = now - stats.createdAt;

      if (!oldestObserver || age > oldestObserver.age) {
        oldestObserver = { key: stats.key, age };
      }

      if (!newestObserver || age < newestObserver.age) {
        newestObserver = { key: stats.key, age };
      }

      if (!mostUsedObserver || stats.elementCount > mostUsedObserver.elementCount) {
        mostUsedObserver = { key: stats.key, elementCount: stats.elementCount };
      }
    });

    // 🆕 内存估算（粗略）
    const estimatedMemoryPerObserver = 1024; // ~1KB per observer
    const estimatedMemoryPerElement = 100; // ~100B per element callback
    const totalMemory = observerCount * estimatedMemoryPerObserver + elementCount * estimatedMemoryPerElement;
    const memoryEstimate =
      totalMemory > 1024 * 1024
        ? `${(totalMemory / (1024 * 1024)).toFixed(2)} MB`
        : `${(totalMemory / 1024).toFixed(2)} KB`;

    return {
      observerCount,
      elementCount,
      averageElementsPerObserver: Math.round(averageElementsPerObserver * 100) / 100,
      oldestObserver,
      newestObserver,
      mostUsedObserver,
      totalCallbackExecutions: this.totalCallbackExecutions,
      memoryEstimate,
    };
  }

  /**
   * 🆕 获取每个 Observer 的详细信息
   */
  public getObserverDetails(): ObserverStats[] {
    return Array.from(this.observerStats.values());
  }

  /**
   * 🆕 手动清理空闲 Observer
   */
  public cleanup(): number {
    let cleaned = 0;
    const now = Date.now();

    this.observerCallbacks.forEach((callbacks, key) => {
      if (callbacks.size === 0) {
        const observer = this.observers.get(key);
        if (observer) {
          observer.disconnect();
          this.observers.delete(key);
          this.observerCallbacks.delete(key);
          this.observerStats.delete(key);
          cleaned++;
        }
      }
    });

    if (this.debugMode) {
      console.log(`[ObserverPool] Manual cleanup: removed ${cleaned} idle observers`);
    }

    return cleaned;
  }

  /**
   * 🆕 重置统计信息（保留 Observer）
   */
  public resetStats(): void {
    this.totalCallbackExecutions = 0;
    this.observerStats.forEach((stats) => {
      stats.totalCallbacks = 0;
    });

    if (this.debugMode) {
      console.log("[ObserverPool] Stats reset");
    }
  }
}

// 导出单例实例
export const observerPool = IntersectionObserverPool.getInstance();

// 导出便捷方法
export const observeElement = (
  element: Element,
  callback: (isIntersecting: boolean) => void,
  config?: ObserverConfig,
  unobserveOnVisible?: boolean
) => observerPool.observe(element, callback, config, unobserveOnVisible);

export const unobserveElement = (element: Element) => observerPool.unobserve(element);

export const getObserverPoolStats = () => observerPool.getStats();

// 🆕 额外导出的增强方法
export const setObserverPoolDebugMode = (enabled: boolean) => observerPool.setDebugMode(enabled);

export const getObserverPoolDetails = () => observerPool.getObserverDetails();

export const cleanupObserverPool = () => observerPool.cleanup();

export const resetObserverPoolStats = () => observerPool.resetStats();

