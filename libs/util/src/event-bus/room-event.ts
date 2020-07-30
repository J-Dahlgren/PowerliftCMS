import { IEvent } from "./event";

export interface IRoomEvent<T> {
  room: string;
  data: T;
}

export interface RoomEvent<T extends object, K extends keyof T = keyof T>
  extends IEvent<T, K> {
  room: string;
}

export type RoomBus<T extends object> = {
  [key in keyof T]: IRoomEvent<T[key]>;
};
