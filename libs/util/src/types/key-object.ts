import { Null } from "./nullable";

export interface StringKeyObject<T> {
  [key: string]: T | Null;
}
export interface NumberKeyObject<T> {
  [key: number]: T | Null;
}
