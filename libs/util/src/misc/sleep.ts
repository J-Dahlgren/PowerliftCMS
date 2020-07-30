export function sleep(sleepTimeMillis: number) {
  return new Promise(resolve => setTimeout(() => resolve(), sleepTimeMillis));
}
