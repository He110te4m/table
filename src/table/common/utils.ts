export function log(info: string) {
  // TODO: 判断执行环境是否为 dev
  window.console.log(`[CTable]: ${info}`);
}