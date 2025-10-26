import type { LazyImagePlugin } from "../../plugins/types";

export interface ExifOrientationConfig {
  enabled?: boolean;
}

export function createExifOrientationPlugin(
  config: ExifOrientationConfig = {}
): LazyImagePlugin {
  const { enabled = true } = config;

  return {
    name: "exif-orientation",
    version: "1.0.0",
    config,
    hooks: {
      transformProps: (props) => {
        if (!enabled) return props;
        const imageStyle = {
          ...(props.imageStyle || {}),
          imageOrientation: "from-image" as any,
        } as React.CSSProperties as any;
        return {
          ...props,
          imageStyle,
        };
      },
    },
  } as LazyImagePlugin;
}