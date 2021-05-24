import { Subject, Observable, Observer } from "rxjs";
import { filter, map } from "rxjs/operators";
import { RoomEvent } from "./room-event";
import { HotValue, getHotValue } from "../types";

export interface IRoomRequest<T extends object> {
  room: string;
  receiver: Observer<Partial<T>>;
}
export interface InRoom<T extends {}> {
  readonly on: <K extends keyof T>(type: K) => Observable<T[K]>;
  readonly emit: <K extends keyof T>(type: K, payload: T[K]) => void;
  readonly any: () => Observable<RoomEvent<T>>;
  readonly onRequest: () => Observable<IRoomRequest<T>>;
  readonly request: () => Observable<Partial<T>>;
}
export abstract class ProtectedRoomEventBus<T extends object> {
  private roomRequests = new Subject<IRoomRequest<T>>();
  protected bus = new Subject<RoomEvent<T>>();

  constructor() {}

  protected _emit<K extends keyof T>(room: string, type: K, payload: T[K]) {
    this.bus.next({ room, type, payload });
  }
  any(room?: HotValue<string>) {
    return this.bus
      .asObservable()
      .pipe(filter((e) => !room || e.room === getHotValue(room)));
  }

  onRoomRequest(room?: HotValue<string>): Observable<IRoomRequest<T>> {
    return this.roomRequests
      .asObservable()
      .pipe(filter((event) => !room || event.room === getHotValue(room)));
  }
  requestRoom(room: HotValue<string>): Observable<Partial<T>> {
    return new Observable<Partial<T>>((receiver) => {
      this.roomRequests.next({ room: getHotValue(room), receiver });
    });
  }
  onIn<K extends keyof T>(type: K, room: HotValue<string>) {
    return this.on(type).pipe(
      filter((event) => event.room === getHotValue(room)),
      map((event) => event.payload as T[K])
    );
  }
  in(room: HotValue<string>): InRoom<T> {
    return {
      on: <K extends keyof T>(type: K) => this.onIn<K>(type, room),
      emit: <K extends keyof T>(type: K, payload: T[K]) => {},
      any: () => this.any(room),
      onRequest: () => this.onRoomRequest(room),
      request: () => this.requestRoom(room),
    };
  }

  on<K extends keyof T>(type: K) {
    return this.bus.asObservable().pipe(filter((event) => event.type === type));
  }
}

export class RoomEventBus<T extends object> extends ProtectedRoomEventBus<T> {
  constructor() {
    super();
  }
  emit<K extends keyof T>(room: string, type: K, payload: T[K]) {
    this._emit(room, type, payload);
  }
  in(room: HotValue<string>): InRoom<T> {
    return {
      on: <K extends keyof T>(type: K) => this.onIn<K>(type, room),
      emit: <K extends keyof T>(type: K, payload: T[K]) =>
        this._emit(getHotValue(room), type, payload),
      any: () => this.any(room),
      onRequest: () => this.onRoomRequest(room),
      request: () => this.requestRoom(room),
    };
  }
}
