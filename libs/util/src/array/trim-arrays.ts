import { extractKeys } from "../types/extract";

export function trimArrays<
  T extends {
    [key: string]: any[];
  }
>(target: T, cutFromStart = true) {
  const targetLength = Math.min(
    ...extractKeys(target).map((key) => target[key].length)
  );
  const result = {} as T;
  for (const key of extractKeys(target)) {
    const array = target[key];
    while (array.length > targetLength) {
      if (cutFromStart) {
        array.shift();
      } else {
        array.pop();
      }
    }
    result[key] = array;
  }
  return result;
}
