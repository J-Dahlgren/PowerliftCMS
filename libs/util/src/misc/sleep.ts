export function sleep(sleepTimeMillis: number): Promise<void> {
  return new Promise((resolve) => setTimeout(() => resolve(), sleepTimeMillis));
}
