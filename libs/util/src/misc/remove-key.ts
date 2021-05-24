import { StringKeyObject, NumberKeyObject } from "../types";
export function removeKey<
  K extends keyof KeyT,
  KeyT extends StringKeyObject<ValueT> | NumberKeyObject<ValueT>,
  ValueT
>(keyToRemove: K, obj: KeyT) {
  const result = {} as any;
  Object.keys(obj)
    .filter((k) => k !== keyToRemove)
    .forEach((k) => (result[k] = (obj as any)[k]));
  return result as KeyT;
}
