/**
 * 性能监控工具类 (Issue #23)
 *
 * 提供图片加载性能监控和分析功能：
 * - 关键时间点标记 (mark)
 * - 性能测量 (measure)
 * - 自动收集 Web Vitals 指标
 * - 生成性能报告
 *
 * @example
 * ```typescript
 * const monitor = createPerformanceMonitor('my-image');
 * monitor.mark('start');
 * // ... 加载图片 ...
 * monitor.mark('loaded');
 * monitor.measure('load-duration', 'start', 'loaded');
 * const report = monitor.getReport();
 * ```
 */

/**
 * 性能指标接口
 */
export interface PerformanceMetrics {
  /** 标记时间戳 (mark) */
  marks: Record<string, number>;
  /** 测量结果 (measure) */
  measures: Record<string, number>;
  /** Web Vitals 指标 */
  vitals?: {
    /** Largest Contentful Paint (最大内容绘制) */
    lcp?: number;
    /** First Contentful Paint (首次内容绘制) */
    fcp?: number;
    /** Time to First Byte (首字节时间) */
    ttfb?: number;
  };
  /** 自定义指标 */
  custom: Record<string, any>;
}

/**
 * 性能报告接口
 */
export interface PerformanceReport {
  /** 监控器 ID */
  id: string;
  /** 开始时间 */
  startTime: number;
  /** 结束时间 */
  endTime?: number;
  /** 总持续时间 */
  duration?: number;
  /** 性能指标 */
  metrics: PerformanceMetrics;
  /** 关键路径分析 */
  criticalPath?: {
    /** 发现延迟 (discovery delay) */
    discoveryDelay?: number;
    /** 加载延迟 (load delay) */
    loadDelay?: number;
    /** 渲染延迟 (render delay) */
    renderDelay?: number;
  };
  /** 建议 */
  recommendations?: string[];
}

/**
 * 性能监控器配置
 */
export interface PerformanceMonitorConfig {
  /** 启用性能监控 */
  enabled?: boolean;
  /** 自动收集 Web Vitals */
  collectVitals?: boolean;
  /** 启用调试日志 */
  enableDebug?: boolean;
  /** 数据保留时间 (ms)，默认 5 分钟 */
  retentionTime?: number;
}

/**
 * 性能监控器类
 */
export class PerformanceMonitor {
  private id: string;
  private config: Required<PerformanceMonitorConfig>;
  private metrics: PerformanceMetrics;
  private startTime: number;
  private endTime?: number;

  constructor(id: string, config: PerformanceMonitorConfig = {}) {
    this.id = id;
    this.config = {
      enabled: config.enabled ?? true,
      collectVitals: config.collectVitals ?? true,
      enableDebug: config.enableDebug ?? false,
      retentionTime: config.retentionTime ?? 5 * 60 * 1000, // 5 分钟
    };

    this.metrics = {
      marks: {},
      measures: {},
      custom: {},
    };

    this.startTime = this.now();

    if (this.config.collectVitals) {
      this.collectWebVitals();
    }

    if (this.config.enableDebug) {
      console.debug(`[PerformanceMonitor] Created: ${this.id}`);
    }
  }

  /**
   * 获取当前时间戳（高精度）
   */
  private now(): number {
    return performance.now();
  }

  /**
   * 添加性能标记
   * @param name - 标记名称
   */
  mark(name: string): void {
    if (!this.config.enabled) return;

    const timestamp = this.now();
    this.metrics.marks[name] = timestamp;

    // 使用 Performance API 创建标记（如果可用）
    if (typeof performance !== 'undefined' && performance.mark) {
      try {
        performance.mark(`${this.id}:${name}`);
      } catch (error) {
        // 忽略错误（某些环境可能不支持）
      }
    }

    if (this.config.enableDebug) {
      console.debug(`[PerformanceMonitor] Mark: ${name} @ ${timestamp.toFixed(2)}ms`);
    }
  }

  /**
   * 测量两个标记之间的时间
   * @param name - 测量名称
   * @param startMark - 开始标记
   * @param endMark - 结束标记（可选，默认为当前时间）
   * @returns 测量结果（毫秒）
   */
  measure(name: string, startMark: string, endMark?: string): number | undefined {
    if (!this.config.enabled) return undefined;

    const startTime = this.metrics.marks[startMark];
    if (startTime === undefined) {
      console.warn(`[PerformanceMonitor] Start mark not found: ${startMark}`);
      return undefined;
    }

    const endTime = endMark ? this.metrics.marks[endMark] : this.now();
    if (endTime === undefined) {
      console.warn(`[PerformanceMonitor] End mark not found: ${endMark}`);
      return undefined;
    }

    const duration = endTime - startTime;
    this.metrics.measures[name] = duration;

    // 使用 Performance API 创建测量（如果可用）
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(
          `${this.id}:${name}`,
          `${this.id}:${startMark}`,
          endMark ? `${this.id}:${endMark}` : undefined
        );
      } catch (error) {
        // 忽略错误
      }
    }

    if (this.config.enableDebug) {
      console.debug(`[PerformanceMonitor] Measure: ${name} = ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  /**
   * 添加自定义指标
   * @param key - 指标键
   * @param value - 指标值
   */
  setCustomMetric(key: string, value: any): void {
    if (!this.config.enabled) return;
    this.metrics.custom[key] = value;
  }

  /**
   * 收集 Web Vitals 指标
   */
  private collectWebVitals(): void {
    if (typeof performance === 'undefined') return;

    this.metrics.vitals = {};

    // 尝试获取 Navigation Timing
    if (performance.timing) {
      const timing = performance.timing;
      const navigationStart = timing.navigationStart;

      // TTFB
      if (timing.responseStart) {
        this.metrics.vitals.ttfb = timing.responseStart - navigationStart;
      }
    }

    // 尝试使用 PerformanceObserver 获取 LCP 和 FCP
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        // FCP
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
          if (fcpEntry && this.metrics.vitals) {
            this.metrics.vitals.fcp = fcpEntry.startTime;
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });

        // LCP
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry && this.metrics.vitals) {
            this.metrics.vitals.lcp = lastEntry.startTime;
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        // 某些环境可能不支持 PerformanceObserver
      }
    }
  }

  /**
   * 结束监控
   */
  end(): void {
    if (!this.endTime) {
      this.endTime = this.now();
      this.mark('end');

      if (this.config.enableDebug) {
        console.debug(`[PerformanceMonitor] Ended: ${this.id}`);
      }
    }
  }

  /**
   * 分析关键路径
   */
  private analyzeCriticalPath(): PerformanceReport['criticalPath'] {
    const marks = this.metrics.marks;
    const criticalPath: NonNullable<PerformanceReport['criticalPath']> = {};

    // 发现延迟：从组件挂载到开始加载
    if (marks['mount'] !== undefined && marks['load-start'] !== undefined) {
      criticalPath.discoveryDelay = marks['load-start'] - marks['mount'];
    }

    // 加载延迟：从开始加载到加载完成
    if (marks['load-start'] !== undefined && marks['load-end'] !== undefined) {
      criticalPath.loadDelay = marks['load-end'] - marks['load-start'];
    }

    // 渲染延迟：从加载完成到渲染完成
    if (marks['load-end'] !== undefined && marks['render-end'] !== undefined) {
      criticalPath.renderDelay = marks['render-end'] - marks['load-end'];
    }

    return Object.keys(criticalPath).length > 0 ? criticalPath : undefined;
  }

  /**
   * 生成性能建议
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const criticalPath = this.analyzeCriticalPath();

    if (criticalPath?.discoveryDelay && criticalPath.discoveryDelay > 100) {
      recommendations.push(
        `发现延迟较高 (${criticalPath.discoveryDelay.toFixed(0)}ms)，考虑使用 preload 或提前触发加载`
      );
    }

    if (criticalPath?.loadDelay && criticalPath.loadDelay > 2000) {
      recommendations.push(
        `加载延迟较高 (${criticalPath.loadDelay.toFixed(0)}ms)，考虑优化图片大小或使用 CDN`
      );
    }

    if (criticalPath?.renderDelay && criticalPath.renderDelay > 50) {
      recommendations.push(
        `渲染延迟较高 (${criticalPath.renderDelay.toFixed(0)}ms)，考虑优化渲染逻辑`
      );
    }

    // 检查 LCP
    if (this.metrics.vitals?.lcp && this.metrics.vitals.lcp > 2500) {
      recommendations.push(
        `LCP 较慢 (${this.metrics.vitals.lcp.toFixed(0)}ms)，建议优化首屏图片加载`
      );
    }

    return recommendations;
  }

  /**
   * 获取性能报告
   */
  getReport(): PerformanceReport {
    const duration = this.endTime
      ? this.endTime - this.startTime
      : this.now() - this.startTime;

    return {
      id: this.id,
      startTime: this.startTime,
      endTime: this.endTime,
      duration,
      metrics: this.metrics,
      criticalPath: this.analyzeCriticalPath(),
      recommendations: this.generateRecommendations(),
    };
  }

  /**
   * 清理资源
   */
  dispose(): void {
    // 清理 Performance API 标记和测量
    if (typeof performance !== 'undefined') {
      try {
        const entries = performance.getEntriesByType('mark');
        entries.forEach((entry) => {
          if (entry.name.startsWith(`${this.id}:`)) {
            performance.clearMarks(entry.name);
          }
        });

        const measures = performance.getEntriesByType('measure');
        measures.forEach((entry) => {
          if (entry.name.startsWith(`${this.id}:`)) {
            performance.clearMeasures(entry.name);
          }
        });
      } catch (error) {
        // 忽略错误
      }
    }

    if (this.config.enableDebug) {
      console.debug(`[PerformanceMonitor] Disposed: ${this.id}`);
    }
  }
}

/**
 * 创建性能监控器
 * @param id - 监控器 ID
 * @param config - 配置选项
 * @returns 性能监控器实例
 */
export function createPerformanceMonitor(
  id: string,
  config?: PerformanceMonitorConfig
): PerformanceMonitor {
  return new PerformanceMonitor(id, config);
}

/**
 * 全局性能监控器管理
 */
class PerformanceMonitorManager {
  private monitors = new Map<string, PerformanceMonitor>();
  private config: PerformanceMonitorConfig;

  constructor(config: PerformanceMonitorConfig = {}) {
    this.config = config;
  }

  /**
   * 创建或获取监控器
   */
  getOrCreate(id: string): PerformanceMonitor {
    let monitor = this.monitors.get(id);
    if (!monitor) {
      monitor = createPerformanceMonitor(id, this.config);
      this.monitors.set(id, monitor);
    }
    return monitor;
  }

  /**
   * 获取所有监控器的报告
   */
  getAllReports(): PerformanceReport[] {
    return Array.from(this.monitors.values()).map((monitor) => monitor.getReport());
  }

  /**
   * 清理过期的监控器
   */
  cleanup(retentionTime: number = 5 * 60 * 1000): void {
    const now = performance.now();
    this.monitors.forEach((monitor, id) => {
      const report = monitor.getReport();
      if (report.endTime && now - report.endTime > retentionTime) {
        monitor.dispose();
        this.monitors.delete(id);
      }
    });
  }

  /**
   * 清理所有监控器
   */
  disposeAll(): void {
    this.monitors.forEach((monitor) => monitor.dispose());
    this.monitors.clear();
  }
}

/**
 * 全局性能监控器管理实例
 */
let globalManager: PerformanceMonitorManager | null = null;

/**
 * 获取全局性能监控器管理器
 */
export function getGlobalMonitorManager(
  config?: PerformanceMonitorConfig
): PerformanceMonitorManager {
  if (!globalManager) {
    globalManager = new PerformanceMonitorManager(config);
  }
  return globalManager;
}

/**
 * 重置全局管理器（主要用于测试）
 */
export function resetGlobalMonitorManager(): void {
  if (globalManager) {
    globalManager.disposeAll();
    globalManager = null;
  }
}

