/**
 * @author: he110
 * @since: 2021-10-30 23:37:00
 * @description: 统一封装的日志函数，仅在 dev 下打日志
 * @Last Modified by: he110
 * @Last Modified time: 2021-10-30 23:37:00
 */

/** 普通日志 */
export function log(...args: unknown[]) {
  import.meta.env.DEV &&
    import.meta.env.MODE !== 'test' &&
    window.console.log(getLogHeader(), ...args);
}

/** 错误日志 */
export function error(...args: unknown[]) {
  import.meta.env.MODE !== 'test' &&
    window.console.error(getLogHeader(), ...args);
}

/** 堆栈追踪日志 */
export function trace(...args: unknown[]) {
  import.meta.env.MODE !== 'test' &&
    window.console.trace(getLogHeader(), ...args);
}

/** 警告日志 */
export function warn(...args: unknown[]) {
  import.meta.env.DEV &&
    import.meta.env.MODE !== 'test' &&
    window.console.warn(getLogHeader(), ...args);
}

/** 信息日志 */
export function info(...args: unknown[]) {
  import.meta.env.DEV &&
    import.meta.env.MODE !== 'test' &&
    window.console.info(getLogHeader(), ...args);
}

/** 生成日志头信息 */
function getLogHeader() {
  const date = new Date();
  return `[CTable][${date.toLocaleDateString()}-${date.toLocaleTimeString()}]: `;
}
