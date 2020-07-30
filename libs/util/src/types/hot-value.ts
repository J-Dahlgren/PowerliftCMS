export type HotValue<T> = (() => T) | T;

export function getHotValue<T>(value: HotValue<T>) {
  return typeof value === "function" ? (value as () => T)() : value;
}
