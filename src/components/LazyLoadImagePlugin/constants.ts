/**
 * LazyLoadImagePlugin 常量定义 (Issue #31)
 *
 * 集中管理所有魔法数字和字符串，提高可维护性
 */

// ============================================================================
// 插件系统
// ============================================================================

/**
 * 插件优先级常量
 */
export const PLUGIN_PRIORITY = {
  /** 最高优先级 (0-10) */
  CRITICAL: 10,
  /** 高优先级 (10-50) */
  HIGH: 50,
  /** 普通优先级 (50-100，默认) */
  NORMAL: 100,
  /** 低优先级 (100-200) */
  LOW: 150,
  /** 调试优先级 (200+) */
  DEBUG: 200,
} as const;

/**
 * 插件事件名称
 */
export const PLUGIN_EVENTS = {
  // 生命周期事件
  BEFORE_LOAD: 'onBeforeLoad',
  LOAD_START: 'onLoadStart',
  LOAD_SUCCESS: 'onLoadSuccess',
  LOAD_ERROR: 'onLoadError',
  LOAD: 'onLoad',

  // 视口事件
  ENTER_VIEWPORT: 'onEnterViewport',
  LEAVE_VIEWPORT: 'onLeaveViewport',

  // 组件生命周期
  MOUNT: 'onMount',
  UNMOUNT: 'onUnmount',

  // 其他事件
  PROGRESS: 'onProgress',
  SRC_CHANGE: 'onSrcChange',
  NETWORK_CHANGE: 'onNetworkChange',
  RESIZE: 'onResize',
  RETRY: 'onRetry',
} as const;

// ============================================================================
// FetchLoader Plugin
// ============================================================================

/**
 * FetchLoader 默认配置
 */
export const FETCH_LOADER_DEFAULTS = {
  /** 请求超时时间（毫秒） */
  TIMEOUT: 30000, // 30 秒

  /** 最大重试次数 */
  MAX_RETRIES: 3,

  /** 初始重试延迟（毫秒） */
  RETRY_DELAY: 1000, // 1 秒

  /** 重试退避倍数 */
  RETRY_BACKOFF: 2,

  /** in-flight 请求缓存大小 */
  CACHE_SIZE_INFLIGHT: 50,

  /** 控制器缓存大小 */
  CACHE_SIZE_CONTROLLERS: 50,

  /** objectURL 缓存大小 */
  CACHE_SIZE_OBJECT_URLS: 100,
} as const;

// ============================================================================
// HTTP 状态码
// ============================================================================

/**
 * HTTP 状态码范围
 */
export const HTTP_STATUS = {
  /** 客户端错误起始 (4xx) */
  CLIENT_ERROR_MIN: 400,

  /** 客户端错误结束 */
  CLIENT_ERROR_MAX: 500,

  /** 服务器错误起始 (5xx) */
  SERVER_ERROR_MIN: 500,

  /** 服务器错误结束 */
  SERVER_ERROR_MAX: 600,

  // 常用状态码
  OK: 200,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ============================================================================
// 性能监控
// ============================================================================

/**
 * 性能监控默认配置
 */
export const PERFORMANCE_DEFAULTS = {
  /** 数据保留时间（毫秒） */
  RETENTION_TIME: 5 * 60 * 1000, // 5 分钟

  /** 高发现延迟阈值（毫秒） */
  HIGH_DISCOVERY_DELAY_THRESHOLD: 100,

  /** 高加载延迟阈值（毫秒） */
  HIGH_LOAD_DELAY_THRESHOLD: 2000,

  /** 高渲染延迟阈值（毫秒） */
  HIGH_RENDER_DELAY_THRESHOLD: 50,

  /** LCP 慢阈值（毫秒） */
  SLOW_LCP_THRESHOLD: 2500,
} as const;

// ============================================================================
// IntersectionObserver
// ============================================================================

/**
 * IntersectionObserver 默认配置
 */
export const INTERSECTION_OBSERVER_DEFAULTS = {
  /** 默认 rootMargin */
  ROOT_MARGIN: '50px',

  /** 默认阈值 */
  THRESHOLD: 0,

  /** 默认是否在可见后取消观察 */
  UNOBSERVE_ON_VISIBLE: true,
} as const;

// ============================================================================
// 事件节流
// ============================================================================

/**
 * 事件节流延迟（毫秒）
 */
export const THROTTLE_DELAYS = {
  /** 网络变化节流 */
  NETWORK_CHANGE: 1000, // 1 秒

  /** 窗口 resize 节流 */
  WINDOW_RESIZE: 300, // 300ms

  /** 滚动事件节流 */
  SCROLL: 100, // 100ms
} as const;

// ============================================================================
// 图片加载
// ============================================================================

/**
 * 图片加载策略
 */
export const IMAGE_LOADING_STRATEGY = {
  /** 懒加载 */
  LAZY: 'lazy',

  /** 立即加载 */
  EAGER: 'eager',

  /** 自动判断 */
  AUTO: 'auto',
} as const;

/**
 * 图片加载优先级
 */
export const IMAGE_FETCH_PRIORITY = {
  /** 高优先级（LCP 图片） */
  HIGH: 'high',

  /** 低优先级 */
  LOW: 'low',

  /** 自动判断 */
  AUTO: 'auto',
} as const;

// ============================================================================
// 导出类型（用于类型推导）
// ============================================================================

export type PluginPriority = typeof PLUGIN_PRIORITY[keyof typeof PLUGIN_PRIORITY];
export type PluginEventName = typeof PLUGIN_EVENTS[keyof typeof PLUGIN_EVENTS];
export type HttpStatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
export type ImageLoadingStrategy = typeof IMAGE_LOADING_STRATEGY[keyof typeof IMAGE_LOADING_STRATEGY];
export type ImageFetchPriority = typeof IMAGE_FETCH_PRIORITY[keyof typeof IMAGE_FETCH_PRIORITY];

