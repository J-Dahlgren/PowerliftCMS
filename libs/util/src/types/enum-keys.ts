import { extractKeys } from "./extract";

export type EnumKeys<T extends object> = keyof T;

export function ExtractEnumKeys<T extends {}>(e: T) {
  return extractKeys(e).filter(k => isNaN(+k));
}
