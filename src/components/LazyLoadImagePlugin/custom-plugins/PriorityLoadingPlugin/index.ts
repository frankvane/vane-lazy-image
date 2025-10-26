import type { LazyImagePlugin } from "../../plugins/types";

export interface PriorityLoadingConfig {
  priority?: "high" | "medium" | "low";
}

export function createPriorityLoadingPlugin(config: PriorityLoadingConfig = {}): LazyImagePlugin {
  const { priority = "medium" } = config;
  return {
    name: "priority-loading",
    version: "1.0.0",
    config,
    hooks: {
      transformProps: (props) => {
        switch (priority) {
          case "high":
            return { ...props, loading: "eager", rootMargin: "0px" };
          case "low":
            return { ...props, loading: "lazy", rootMargin: props.rootMargin ?? "400px" };
          case "medium":
          default:
            return { ...props, loading: "lazy", rootMargin: props.rootMargin ?? "200px" };
        }
      },
    },
  };
}