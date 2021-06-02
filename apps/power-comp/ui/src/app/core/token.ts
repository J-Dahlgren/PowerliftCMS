import {
  ILifterData,
  IPlatformData,
  IServerPlatformEvents,
  PersistentPlatformData,
} from "@pc/power-comp/shared";
import { InRoom, IRoomRequest, RoomEvent } from "@pc/util";
import { Observable } from "rxjs";
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
export abstract class IPlatformDataEvents implements InRoom<IPlatformData> {
  abstract on: <K extends keyof ILifterData | "activeGroupId">(
    type: K
  ) => Observable<PersistentPlatformData[K]>;
  abstract emit: <K extends keyof ILifterData | "activeGroupId">(
    type: K,
    payload: PersistentPlatformData[K]
  ) => void;
  abstract any: () => Observable<
    RoomEvent<PersistentPlatformData, keyof ILifterData | "activeGroupId">
  >;
  abstract onRequest: () => Observable<IRoomRequest<PersistentPlatformData>>;
  abstract request: () => Observable<Partial<PersistentPlatformData>>;
}
