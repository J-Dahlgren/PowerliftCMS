import { IClientPlatformEvents } from "./client-platform-events";

export interface IPlatformEvent<K extends keyof IClientPlatformEvents> {
  room: number;
  data: IClientPlatformEvents[K];
}
