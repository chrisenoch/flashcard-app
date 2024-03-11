export function triggerCycle(callback: (...args: any[]) => void, ms = 0) {
  setTimeout(() => {
    callback();
  }, ms);
}
