import { trimArrays } from "./trim-arrays";
import { extractKeys } from "../types/extract";

export function mergeArraysToObject<T extends { [key: string]: any[] }>(
  obj: T,
  cutFromStart = true
) {
  const trimmedArray = trimArrays(obj, cutFromStart);
  const keys = extractKeys(trimmedArray);
  if (keys.length < 1) {
    throw new Error("No keys");
  }
  const length = trimmedArray[keys[0]].length;
  const result: { [key in Extract<keyof T, String>]: T[key][0] }[] = [];
  for (let i = 0; i < length; i++) {
    const currentItem = {} as any;
    for (const key of keys) {
      currentItem[key] = trimmedArray[key][i];
    }
    result.push(currentItem);
  }
  return result as { [key in Extract<keyof T, String>]: T[key][0] }[];
}
