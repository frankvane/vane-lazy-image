import * as ReactWindow from "react-window";

import {
  LazyLoadImageCore,
  createConcurrencyControlPlugin,
  createEventLoggerPlugin,
  createFetchLoaderPlugin,
  createIDBCachePlugin,
  createMemoryCachePlugin,
  createOverlayInfoPlugin,
  createPreconnectPlugin,
  createProgressOverlayPlugin,
  createScrollIdlePlugin,
  createSkeletonPlugin,
  createViewportDwellPlugin,
  withPlugins,
} from "vane-lazy-image";

import DemoPage from "./_layout/DemoPage";
import React from "react";

const LazyImage = withPlugins(LazyLoadImageCore as any, [
  createMemoryCachePlugin({ maxEntries: 300, ttlMs: 60 * 60 * 1000 }),
  createIDBCachePlugin({ ttlMs: 7 * 24 * 60 * 60 * 1000 }),
  // 容器级滚动空闲：水平滚动场景
  createScrollIdlePlugin({
    idleMs: 160,
    maxWaitMs: 1200,
    onlyWhenIntersecting: true,
    target: "container",
    axis: "horizontal",
  }),
  // 视口驻留阈值：快速水平滚动时仅加载停留足够的项
  createViewportDwellPlugin({
    dwellMs: 160,
    maxWaitMs: 1000,
    onlyWhenIntersecting: true,
  }),
  // 并发闸控，避免停顿后瞬时触发过多请求
  createConcurrencyControlPlugin({ maxConcurrent: 6 }),
  createFetchLoaderPlugin({ enabled: true }),
  createProgressOverlayPlugin({
    showWhen: "loading",
    height: 3,
    color: "#4caf50",
    showPercentText: true,
  }),
  createSkeletonPlugin({
    type: "shimmer",
    showWhen: "loading",
    borderRadius: 6,
    zIndex: 1,
  }),
  createOverlayInfoPlugin({
    content: (ctx) =>
      `Horizontal • ${new URL(ctx.src, window.location.origin).pathname}`,
    position: "bottom",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    showWhen: "loading",
    zIndex: 4,
  }),
  createPreconnectPlugin({ domains: ["https://picsum.photos"] }),
  createEventLoggerPlugin({ enabled: true, prefix: "[HL-Demo]" }),
]);

const RW = ReactWindow as any;
const GridNew = RW.Grid;
const ListOld = RW.FixedSizeList;

export default function VirtualHorizontalListDemo() {
  const listOuterRef = React.useRef<HTMLDivElement | null>(null);
  const gridRef = React.useRef<any>(null);
  const [rootEl, setRootEl] = React.useState<HTMLElement | undefined>(
    undefined
  );
  const [items] = React.useState(
    Array.from({ length: 180 }).map((_, i) => ({
      id: i,
      src: `https://picsum.photos/seed/virt-h-${i}/800/600`,
    }))
  );

  React.useEffect(() => {
    const api = gridRef.current;
    if (api) {
      const el =
        api?.getElement?.() ||
        api?.getOuterElement?.() ||
        api?.getRootElement?.() ||
        api?._outerRef?.current ||
        api?._outerElement;
      if (el instanceof HTMLElement) setRootEl(el);
    }
  }, []);

  const Cell = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const item = items[index];
    return (
      <div style={{ ...style, padding: 8 }}>
        <div
          style={{
            position: "relative",
            width: 240,
            height: 160,
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
          }}
        >
          <LazyImage
            src={item.src}
            loading="lazy"
            root={rootEl || listOuterRef.current || undefined}
            rootMargin="240px"
            containerStyle={{ width: "100%", height: "100%" }}
            imageStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    );
  };

  return (
    <DemoPage
      title="LazyLoadImagePlugin • 水平虚拟列表示例（react-window）"
      description="结合 react-window 的水平虚拟列表，优化横向滚动图片加载"
    >
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {GridNew ? (
          <GridNew
            cellComponent={({
              columnIndex,
              style,
            }: {
              columnIndex: number;
              style: React.CSSProperties;
            }) => <Cell index={columnIndex} style={style} />}
            columnCount={items.length}
            columnWidth={256}
            rowCount={1}
            rowHeight={220}
            gridRef={gridRef}
            cellProps={{ items }}
            style={{ height: 220, width: 960 }}
          />
        ) : (
          <ListOld
            height={220}
            width={960}
            itemCount={items.length}
            itemSize={256}
            layout="horizontal"
            outerRef={listOuterRef}
            overscanCount={8}
          >
            {Cell as any}
          </ListOld>
        )}
      </div>
    </DemoPage>
  );
}
