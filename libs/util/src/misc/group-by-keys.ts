import { get } from "lodash";

export function groupByKeys<T extends {}>(
  items: T[],
  keys: string[]
): { [key: string]: T[] } {
  const groups = {} as { [key: string]: T[] };
  for (const item of items) {
    const keyValues = keys.map(key => `${get(item, key)}`).join("_");
    if (!keyValues) {
      continue;
    }
    if (!groups[keyValues]) {
      groups[keyValues] = [item];
    } else {
      groups[keyValues].push(item);
    }
  }
  return groups;
}
