/**
 * useLCPPreload - 为 LCP 图片添加预加载支持
 *
 * 当图片被标记为 LCP (Largest Contentful Paint) 元素时，
 * 通过添加 <link rel="preload"> 来提前加载图片，减少 LCP 时间。
 *
 * @example
 * ```tsx
 * function MyImage() {
 *   useLCPPreload('/my-hero-image.jpg', true);
 *   return <img src="/my-hero-image.jpg" />;
 * }
 * ```
 */

import { useEffect } from 'react';

export interface LCPPreloadOptions {
  /**
   * 是否启用预加载
   * @default false
   */
  enabled: boolean;

  /**
   * 图片加载优先级
   * @default 'high'
   */
  fetchPriority?: 'high' | 'low' | 'auto';

  /**
   * 图片类型
   * @default 'image'
   */
  as?: 'image' | 'fetch';

  /**
   * 响应式图片源集
   * 如果提供，将用于 imagesrcset 属性
   */
  imageSrcSet?: string;

  /**
   * 响应式图片尺寸
   * 如果提供 imageSrcSet，应同时提供此属性
   */
  imageSizes?: string;
}

/**
 * 为 LCP 图片添加预加载链接
 *
 * @param src - 图片 URL
 * @param enabled - 是否启用预加载
 * @param options - 预加载选项
 */
export function useLCPPreload(
  src: string,
  enabled: boolean,
  options?: Omit<LCPPreloadOptions, 'enabled'>
): void {
  const {
    fetchPriority = 'high',
    as = 'image',
    imageSrcSet,
    imageSizes,
  } = options || {};

  useEffect(() => {
    if (!enabled || !src) return;

    // 检查是否已经存在相同的预加载链接
    const existingLink = document.querySelector(
      `link[rel="preload"][href="${src}"]`
    ) as HTMLLinkElement;

    if (existingLink) {
      // 如果已存在，不需要重复添加
      return;
    }

    // 创建预加载链接
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = src;

    // 设置 fetchpriority（注意：在 DOM 中使用小写）
    if (fetchPriority !== 'auto') {
      link.setAttribute('fetchpriority', fetchPriority);
    }

    // 响应式图片支持
    if (imageSrcSet) {
      link.setAttribute('imagesrcset', imageSrcSet);
      if (imageSizes) {
        link.setAttribute('imagesizes', imageSizes);
      }
    }

    // 添加到 head
    document.head.appendChild(link);

    // 清理函数：组件卸载时移除预加载链接
    return () => {
      if (link.parentNode === document.head) {
        document.head.removeChild(link);
      }
    };
  }, [src, enabled, fetchPriority, as, imageSrcSet, imageSizes]);
}

/**
 * 简化版：只需要提供 src 和 enabled
 */
export function useImagePreload(src: string, enabled: boolean): void {
  useLCPPreload(src, enabled);
}

export default useLCPPreload;



