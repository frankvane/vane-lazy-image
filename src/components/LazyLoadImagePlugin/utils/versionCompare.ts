/**
 * 版本比较工具
 * Issue #22: 添加版本兼容性检查
 */

/**
 * 比较两个语义化版本号
 * @param v1 版本 1 (如 "1.2.3")
 * @param v2 版本 2 (如 "1.3.0")
 * @returns -1 (v1 < v2), 0 (v1 === v2), 1 (v1 > v2)
 *
 * @example
 * compareVersions("1.0.0", "1.0.1")  // -1
 * compareVersions("2.0.0", "1.9.9")  // 1
 * compareVersions("1.2.3", "1.2.3")  // 0
 */
export function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);

  const maxLength = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < maxLength; i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;

    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }

  return 0;
}

/**
 * 检查版本是否在指定范围内
 * @param version 当前版本
 * @param minVersion 最低版本（含），undefined 表示无下限
 * @param maxVersion 最高版本（含），undefined 表示无上限
 * @returns 是否在范围内
 *
 * @example
 * isVersionInRange("1.5.0", "1.0.0", "2.0.0")  // true
 * isVersionInRange("0.9.0", "1.0.0", "2.0.0")  // false
 * isVersionInRange("1.5.0", "1.0.0", undefined)  // true (无上限)
 * isVersionInRange("1.5.0", undefined, "2.0.0")  // true (无下限)
 */
export function isVersionInRange(
  version: string,
  minVersion?: string,
  maxVersion?: string
): boolean {
  if (minVersion && compareVersions(version, minVersion) < 0) {
    return false;
  }

  if (maxVersion && compareVersions(version, maxVersion) > 0) {
    return false;
  }

  return true;
}

/**
 * 解析版本号
 * @param version 版本字符串 (如 "1.2.3")
 * @returns {major, minor, patch}
 *
 * @example
 * parseVersion("1.2.3")  // { major: 1, minor: 2, patch: 3 }
 * parseVersion("2.0")    // { major: 2, minor: 0, patch: 0 }
 */
export function parseVersion(version: string): {
  major: number;
  minor: number;
  patch: number;
} {
  const [major = 0, minor = 0, patch = 0] = version.split(".").map(Number);
  return { major, minor, patch };
}

/**
 * 检查版本是否有效
 * @param version 版本字符串
 * @returns 是否为有效的语义化版本
 *
 * @example
 * isValidVersion("1.2.3")  // true
 * isValidVersion("1.0")    // true
 * isValidVersion("abc")    // false
 * isValidVersion("1.2.x")  // false
 */
export function isValidVersion(version: string): boolean {
  const parts = version.split(".");
  if (parts.length < 1 || parts.length > 3) {
    return false;
  }

  return parts.every((part) => {
    const num = Number(part);
    return !isNaN(num) && num >= 0 && Number.isInteger(num);
  });
}

/**
 * 格式化版本号为标准格式
 * @param version 版本字符串
 * @returns 标准格式的版本号 (major.minor.patch)
 *
 * @example
 * formatVersion("1.2")    // "1.2.0"
 * formatVersion("1")      // "1.0.0"
 * formatVersion("1.2.3")  // "1.2.3"
 */
export function formatVersion(version: string): string {
  const { major, minor, patch } = parseVersion(version);
  return `${major}.${minor}.${patch}`;
}

/**
 * 比较版本是否相等
 * @param v1 版本 1
 * @param v2 版本 2
 * @returns 是否相等
 *
 * @example
 * isVersionEqual("1.0.0", "1.0")  // true
 * isVersionEqual("1.0.0", "1.0.1")  // false
 */
export function isVersionEqual(v1: string, v2: string): boolean {
  return compareVersions(v1, v2) === 0;
}

/**
 * 检查版本 v1 是否大于 v2
 * @param v1 版本 1
 * @param v2 版本 2
 * @returns v1 > v2
 */
export function isVersionGreater(v1: string, v2: string): boolean {
  return compareVersions(v1, v2) > 0;
}

/**
 * 检查版本 v1 是否小于 v2
 * @param v1 版本 1
 * @param v2 版本 2
 * @returns v1 < v2
 */
export function isVersionLess(v1: string, v2: string): boolean {
  return compareVersions(v1, v2) < 0;
}

