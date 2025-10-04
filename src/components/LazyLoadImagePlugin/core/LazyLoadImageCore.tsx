/**
 * LazyLoadImagePlugin/Core - 极简核心组件（供插件系统增强）
 *
 * 职责：
 * - IntersectionObserver 视口检测
 * - 基础图片加载（带生命周期回调）
 * - 状态管理（idle/loading/loaded/error）
 * - 预留扩展接口与 children 注入（供插件渲染）
 */

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

export interface LazyLoadImageCoreProps {
  src: string;
  alt?: string;

  // IO 配置
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
  unobserveOnVisible?: boolean;

  // 加载策略
  loading?: "lazy" | "eager";

  // 生命周期回调（由 HOC 注入以连接插件）
  onBeforeLoad?: () => Promise<string | undefined> | string | undefined;
  onLoadStart?: () => void;
  onLoadSuccess?: (displaySrc?: string) => void;
  onLoadError?: (error: Error) => void;
  onEnterViewport?: () => void;
  onLeaveViewport?: () => void;

  // 渲染增强
  children?: React.ReactNode;

  // 样式
  containerStyle?: React.CSSProperties;
  containerClassName?: string;
  imageStyle?: React.CSSProperties;
  imageClassName?: string;
  /** 允许插件/调用方为 <img> 设置跨域策略，以支持像素读取等功能 */
  crossOrigin?: "anonymous" | "use-credentials" | "" | null;
  // 供 HOC 传入的外部引用，便于插件访问真实 DOM
  containerRefExternal?: React.RefObject<HTMLDivElement | null>;
  imageRefExternal?: React.RefObject<HTMLImageElement | null>;
}

export interface ImageState {
  isIdle: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
}

export interface LazyLoadImageCoreRef {
  reload: () => void;
  reset: () => void;
  getState: () => ImageState;
}

function useIntersectionObserver(
  targetRef: React.RefObject<HTMLElement | null>,
  options: {
    root?: Element | Document | null;
    rootMargin?: string;
    threshold?: number | number[];
    unobserveOnVisible?: boolean;
  }
) {
  const { root, rootMargin = "0px", threshold = 0, unobserveOnVisible = true } =
    options || {};
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    let observer: IntersectionObserver | null = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const isIntersecting = entry.isIntersecting || entry.intersectionRatio > 0;
        setInView(isIntersecting);
        if (isIntersecting && unobserveOnVisible) {
          observer?.unobserve(el);
        }
      },
      { root: (root as Element) || null, rootMargin, threshold }
    );

    observer.observe(el);
    return () => {
     // eslint-disable-next-line
      observer && observer.disconnect();
      observer = null;
    };
  }, [targetRef.current, root, rootMargin, threshold, unobserveOnVisible]);

  return { inView };
}

export const LazyLoadImageCore = forwardRef<LazyLoadImageCoreRef, LazyLoadImageCoreProps>(
  (props, ref) => {
    const {
      src,
      alt = "",
      root,
      rootMargin,
      threshold,
      unobserveOnVisible,
      loading = "lazy",
      onBeforeLoad,
      onLoadStart,
      onLoadSuccess,
      onLoadError,
      onEnterViewport,
      onLeaveViewport,
      children,
      containerStyle,
      containerClassName,
      imageStyle,
      imageClassName,
    } = props;

    const containerRef = useRef<HTMLDivElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    const [state, setState] = useState<ImageState>({
      isIdle: true,
      isLoading: false,
      isLoaded: false,
      isError: false,
    });
    const [displaySrc, setDisplaySrc] = useState<string | null>(null);

    const { inView } = useIntersectionObserver(containerRef, {
      root,
      rootMargin,
      threshold,
      unobserveOnVisible,
    });

    // 视口进入/离开
    const prevInViewRef = useRef<boolean>(false);
    useEffect(() => {
      if (inView && !prevInViewRef.current) {
        onEnterViewport?.();
      } else if (!inView && prevInViewRef.current) {
        onLeaveViewport?.();
      }
      prevInViewRef.current = inView;
    }, [inView, onEnterViewport, onLeaveViewport]);

    const startLoad = useCallback(async () => {
      if (state.isLoading || state.isLoaded) return;
      setState((s) => ({ ...s, isIdle: false, isLoading: true, isError: false }));
      onLoadStart?.();

      try {
        const maybeCached = await Promise.resolve(onBeforeLoad?.());
        const finalSrc = maybeCached || src;

        // 直接通过 DOM <img> 触发加载，避免使用脱离 DOM 的 Image 造成重复请求
        setDisplaySrc(finalSrc);
      } catch (error: any) {
        setState({ isIdle: false, isLoading: false, isLoaded: false, isError: true });
        onLoadError?.(error instanceof Error ? error : new Error(String(error)));
      }
    }, [src, onBeforeLoad, onLoadStart, onLoadError, state.isLoading, state.isLoaded]);

    // 当进入视口时开始加载
    useEffect(() => {
      if (inView) {
        startLoad();
      }
    }, [inView, startLoad]);

    // 暴露 Ref 接口
    useImperativeHandle(
      ref,
      () => ({
        reload: () => {
          setState({ isIdle: true, isLoading: false, isLoaded: false, isError: false });
          setDisplaySrc(null);
          // 重新触发加载（若已在视口）
          if (inView) startLoad();
        },
        reset: () => {
          setState({ isIdle: true, isLoading: false, isLoaded: false, isError: false });
          setDisplaySrc(null);
        },
        getState: () => state,
      }),
      [inView, startLoad, state]
    );

    // 渲染
    const containerStyles: React.CSSProperties = useMemo(
      () => ({
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: state.isError ? "#fee" : "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...containerStyle,
      }),
      [containerStyle, state.isError]
    );

    return (
      <div
        ref={(el) => {
          containerRef.current = el;
          if (props.containerRefExternal) {
            (props.containerRefExternal as any).current = el;
          }
        }}
        className={containerClassName}
        style={containerStyles}
      >
        {/* Loading / Placeholder */}
        {state.isLoading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            <span style={{ color: "#999", fontSize: 12 }}>Loading...</span>
          </div>
        )}

        {/* Image - 在加载阶段也渲染，通过 onLoad/onError 更新状态，避免二次请求 */}
        {displaySrc && (
          <img
            ref={(el) => {
              imgRef.current = el;
              if (props.imageRefExternal) {
                (props.imageRefExternal as any).current = el;
              }
            }}
            src={displaySrc}
            alt={alt}
            loading={loading}
            // 提前设置跨域策略，保证加载过程具备像素读取权限（如 Canvas 提取主色）
            crossOrigin={props.crossOrigin ?? undefined}
            onLoad={() => {
              setState({ isIdle: false, isLoading: false, isLoaded: true, isError: false });
              onLoadSuccess?.(displaySrc || undefined);
            }}
            onError={() => {
              const err = new Error("Image load error");
              setState({ isIdle: false, isLoading: false, isLoaded: false, isError: true });
              onLoadError?.(err);
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: state.isLoaded ? 1 : 0,
              transition: "opacity 180ms ease",
              ...imageStyle,
            }}
            className={imageClassName}
          />
        )}

        {/* 插件渲染内容 */}
        {children}
      </div>
    );
  }
);

LazyLoadImageCore.displayName = "LazyLoadImageCore";

export default LazyLoadImageCore;