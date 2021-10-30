export function log(info: string) {
  import.meta.env.DEV && import.meta.env.MODE !== 'test' && window.console.log(`[CTable]: ${info}`);
}
