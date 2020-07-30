export function extractKeys<T extends object>(
  obj: T
): Extract<keyof T, string>[] {
  return Object.keys(obj) as Extract<keyof typeof obj, string>[];
}
export type StringKey<T extends object> = Extract<keyof T, string>;
