/**
 * LRU (Least Recently Used) 缓存实现
 *
 * Issue #3: 用于替代 FetchLoaderPlugin 中无限增长的全局 Map
 *
 * 特性：
 * - 自动淘汰最久未使用的条目
 * - 支持自定义清理回调（用于 revoke blob URL 等）
 * - 线程安全的 get/set 操作
 */

export class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxSize: number;
  private onEvict?: (key: K, value: V) => void;

  /**
   * @param maxSize 最大缓存条目数
   * @param onEvict 条目被淘汰时的回调函数
   */
  constructor(maxSize: number, onEvict?: (key: K, value: V) => void) {
    if (maxSize <= 0) {
      throw new Error("LRUCache maxSize must be greater than 0");
    }
    this.cache = new Map();
    this.maxSize = maxSize;
    this.onEvict = onEvict;
  }

  /**
   * 获取缓存值
   * LRU 策略：访问时移到最后（标记为最近使用）
   */
  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // LRU: 移到最后（最近使用）
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  /**
   * 设置缓存值
   * 如果超过最大值，淘汰最旧的条目
   */
  set(key: K, value: V): void {
    // 如果已存在，先删除（会触发 LRU 更新）
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // 添加新值
    this.cache.set(key, value);

    // 检查是否超过最大值
    if (this.cache.size > this.maxSize) {
      // 删除最旧的（第一个）
      const firstKey = this.cache.keys().next().value as K;
      if (firstKey !== undefined) {
        const evicted = this.cache.get(firstKey);
        this.cache.delete(firstKey);

        // 触发清理回调
        if (this.onEvict && evicted !== undefined) {
          try {
            this.onEvict(firstKey, evicted);
          } catch (error) {
            console.warn("[LRUCache] onEvict callback error:", error);
          }
        }
      }
    }
  }

  /**
   * 删除指定键
   * @returns 是否成功删除
   */
  delete(key: K): boolean {
    const value = this.cache.get(key);
    const deleted = this.cache.delete(key);

    if (deleted && this.onEvict && value !== undefined) {
      try {
        this.onEvict(key, value);
      } catch (error) {
        console.warn("[LRUCache] onEvict callback error:", error);
      }
    }

    return deleted;
  }

  /**
   * 检查键是否存在
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    if (this.onEvict) {
      this.cache.forEach((value, key) => {
        try {
          this.onEvict!(key, value);
        } catch (error) {
          console.warn("[LRUCache] onEvict callback error:", error);
        }
      });
    }
    this.cache.clear();
  }

  /**
   * 获取当前缓存大小
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * 获取所有键
   */
  keys(): IterableIterator<K> {
    return this.cache.keys();
  }

  /**
   * 获取所有值
   */
  values(): IterableIterator<V> {
    return this.cache.values();
  }

  /**
   * 遍历所有条目
   */
  forEach(callback: (value: V, key: K) => void): void {
    this.cache.forEach(callback);
  }
}

