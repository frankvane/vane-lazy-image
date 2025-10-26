/**
 * @module vane-lazy-image/monitoring
 * 性能监控扩展包
 *
 * Bundle Size: ~2-3KB (gzip)
 *
 * 包含：
 * - PerformanceMonitor 性能监控系统
 * - 性能报告生成
 * - 全局监控管理器
 */

// ============================================================================
// 性能监控 (Issue #23)
// ============================================================================
export {
  createPerformanceMonitor,
  getGlobalMonitorManager,
  resetGlobalMonitorManager,
} from "../../utils/PerformanceMonitor";

export type {
  PerformanceMonitor,
  PerformanceReport,
  PerformanceMetrics,
  PerformanceMonitorConfig,
} from "../../utils/PerformanceMonitor";

