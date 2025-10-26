/**
 * 插件依赖解析器
 * Issue #17: 实现插件依赖管理
 */

export class DependencyResolver {
  private dependencies: Map<string, Set<string>>;
  private optionalDependencies: Map<string, Set<string>>;
  private conflicts: Map<string, Set<string>>;

  constructor() {
    this.dependencies = new Map();
    this.optionalDependencies = new Map();
    this.conflicts = new Map();
  }

  /**
   * 添加插件依赖信息
   */
  addPlugin(
    name: string,
    deps?: string[],
    optDeps?: string[],
    confs?: string[]
  ): void {
    if (deps && deps.length > 0) {
      this.dependencies.set(name, new Set(deps));
    }
    if (optDeps && optDeps.length > 0) {
      this.optionalDependencies.set(name, new Set(optDeps));
    }
    if (confs && confs.length > 0) {
      this.conflicts.set(name, new Set(confs));
    }
  }

  /**
   * 移除插件依赖信息
   */
  removePlugin(name: string): void {
    this.dependencies.delete(name);
    this.optionalDependencies.delete(name);
    this.conflicts.delete(name);
  }

  /**
   * 检查依赖是否满足
   */
  checkDependencies(
    pluginName: string,
    registeredPlugins: Set<string>
  ): {
    satisfied: boolean;
    missing: string[];
    optional: string[];
  } {
    const deps = this.dependencies.get(pluginName) || new Set();
    const optDeps = this.optionalDependencies.get(pluginName) || new Set();

    const missing = Array.from(deps).filter((d) => !registeredPlugins.has(d));
    const optionalMissing = Array.from(optDeps).filter(
      (d) => !registeredPlugins.has(d)
    );

    return {
      satisfied: missing.length === 0,
      missing,
      optional: optionalMissing,
    };
  }

  /**
   * 检查冲突
   */
  checkConflicts(
    pluginName: string,
    registeredPlugins: Set<string>
  ): {
    hasConflict: boolean;
    conflicts: string[];
  } {
    const confs = this.conflicts.get(pluginName) || new Set();
    const foundConflicts = Array.from(confs).filter((c) =>
      registeredPlugins.has(c)
    );

    return {
      hasConflict: foundConflicts.length > 0,
      conflicts: foundConflicts,
    };
  }

  /**
   * 检测循环依赖
   */
  detectCycles(): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (node: string, path: string[]): void => {
      if (recursionStack.has(node)) {
        // 找到循环
        const cycleStart = path.indexOf(node);
        if (cycleStart !== -1) {
          cycles.push(path.slice(cycleStart).concat(node));
        }
        return;
      }

      if (visited.has(node)) return;

      visited.add(node);
      recursionStack.add(node);
      path.push(node);

      const deps = this.dependencies.get(node) || new Set();
      for (const dep of deps) {
        dfs(dep, [...path]);
      }

      recursionStack.delete(node);
    };

    for (const node of this.dependencies.keys()) {
      if (!visited.has(node)) {
        dfs(node, []);
      }
    }

    return cycles;
  }

  /**
   * 获取拓扑排序（依赖顺序）
   * 使用 Kahn's 算法
   */
  getTopologicalOrder(plugins: string[]): string[] {
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();

    // 初始化
    for (const plugin of plugins) {
      inDegree.set(plugin, 0);
      adjList.set(plugin, []);
    }

    // 构建图
    for (const plugin of plugins) {
      const deps = this.dependencies.get(plugin) || new Set();
      for (const dep of deps) {
        if (plugins.includes(dep)) {
          adjList.get(dep)!.push(plugin);
          inDegree.set(plugin, (inDegree.get(plugin) || 0) + 1);
        }
      }
    }

    // Kahn's 算法
    const queue: string[] = [];
    const result: string[] = [];

    for (const [plugin, degree] of inDegree) {
      if (degree === 0) queue.push(plugin);
    }

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      for (const neighbor of adjList.get(current) || []) {
        const newDegree = inDegree.get(neighbor)! - 1;
        inDegree.set(neighbor, newDegree);
        if (newDegree === 0) queue.push(neighbor);
      }
    }

    // 如果结果长度不等于输入长度，说明存在循环依赖
    return result.length === plugins.length ? result : [];
  }

  /**
   * 清空所有依赖信息
   */
  clear(): void {
    this.dependencies.clear();
    this.optionalDependencies.clear();
    this.conflicts.clear();
  }

  /**
   * 获取插件的所有依赖（递归）
   */
  getAllDependencies(pluginName: string, visited = new Set<string>()): string[] {
    if (visited.has(pluginName)) {
      return [];
    }

    visited.add(pluginName);
    const deps = Array.from(this.dependencies.get(pluginName) || []);
    const allDeps = [...deps];

    for (const dep of deps) {
      allDeps.push(...this.getAllDependencies(dep, visited));
    }

    return Array.from(new Set(allDeps));
  }
}

