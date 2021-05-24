import { Subject, Observable, Observer, Subscriber } from "rxjs";
import { filter, map, timeout } from "rxjs/operators";
import { IEventBus, IEventServer } from "./i-event-bus";
import { ProtectedEventBus } from "./protected-event-bus";
import { IEvent } from "./event";

export class DataEvent<T extends object> implements IEvent<T> {
  constructor(public type: keyof T, public payload: T[keyof T]) {}
}
export class EventBus<T extends object>
  extends ProtectedEventBus<T>
  implements IEventBus<T>, IEventServer<T> {
  private requests = new Subject<{
    type: keyof T;
    receiver: Subscriber<T[keyof T]>;
  }>();
  emit<K extends keyof T>(type: K, payload: T[K]) {
    this._emit(type, payload);
  }
  request<K extends keyof T>(type: K, timeoutMillis = 100): Observable<T[K]> {
    return new Observable<T[K]>((observer) => {
      this.requests.next({ type, receiver: observer });
    }).pipe(timeout(timeoutMillis));
  }
  onRequest<K extends keyof T>(type: K): Observable<Subscriber<T[K]>> {
    return this.requests.asObservable().pipe(
      filter((event) => event.type === type),
      map((event) => event.receiver as Subscriber<T[K]>)
    );
  }
  onAny() {
    return this.bus.asObservable();
  }
}
