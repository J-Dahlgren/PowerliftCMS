import { Subject } from "rxjs";
import { filter, map, mapTo } from "rxjs/operators";
import { Constructor } from "../types";

export interface PayloadEvent<T> {
  payload: T;
}

export class ClassBus {
  private bus = new Subject<object>();
  emit<T extends object>(event: T) {
    this.bus.next(event);
  }
  public get $() {
    return this.bus.asObservable();
  }
  on<T extends object>(event: Constructor<T>) {
    return this.$.pipe(
      filter((e) => e instanceof event),
      map((e) => e as T)
    );
  }
}
