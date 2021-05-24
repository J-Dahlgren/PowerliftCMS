import { Subject, Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { IEventEmitter } from "./i-event-bus";
import { IEvent } from "./event";

export class ProtectedEventBus<T extends object> implements IEventEmitter<T> {
  protected bus = new Subject<IEvent<T>>();
  protected _emit<K extends keyof T>(type: K, payload: T[K]) {
    this.bus.next({ type, payload });
  }
  any() {
    return this.bus.asObservable();
  }
  on<K extends keyof T>(type: K): Observable<T[K]> {
    return this.bus.asObservable().pipe(
      filter((event) => event.type === type),
      map((event) => event.payload as T[K])
    );
  }
}
