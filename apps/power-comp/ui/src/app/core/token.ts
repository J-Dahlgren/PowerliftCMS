import { IServerPlatformEvents } from "@pc/power-comp/shared";
import { InRoom, IRoomRequest, RoomEvent } from "@pc/util";
import { Observable } from "rxjs";

export const SERVER_EVENTS_TOKEN = "SERVER_EVENTS_TOKEN";
export abstract class IPlatformEvents implements InRoom<IServerPlatformEvents> {
  abstract on: <K extends keyof IServerPlatformEvents>(
    type: K
  ) => Observable<IServerPlatformEvents[K]>;
  abstract emit: <K extends keyof IServerPlatformEvents>(
    type: K,
    payload: IServerPlatformEvents[K]
  ) => void;
  abstract any: () => Observable<
    RoomEvent<IServerPlatformEvents, keyof IServerPlatformEvents>
  >;
  abstract onRequest: () => Observable<IRoomRequest<IServerPlatformEvents>>;
  abstract request: () => Observable<Partial<IServerPlatformEvents>>;
}
export const PLATFORM_DATA_TOKEN = "PLATFORM_DATA_EVENTS_TOKEN";
