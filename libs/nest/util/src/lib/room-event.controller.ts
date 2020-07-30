import { IRoomEvent } from "@dt/util";

export type IRoomEventController<T extends {}> = {
  [key in keyof T]: RoomEventFn<T[key]>;
};

export type RoomEventFn<T extends {}> = (event: IRoomEvent<T[keyof T]>) => void;
