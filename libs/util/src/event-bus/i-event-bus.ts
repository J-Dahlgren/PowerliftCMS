import { Observable, Subscriber } from "rxjs";
import { IEvent } from "./event";

export interface IEventEmitter<T extends object> {
  on<K extends keyof T>(type: K): Observable<T[K]>;
  any(): Observable<IEvent<T>>;
}
export interface IEventRequester<T extends object> {
  request<K extends keyof T>(type: K, timeoutMillis: number): Observable<T[K]>;
}
export interface IEventServer<T extends object> extends IEventRequester<T> {
  onRequest<K extends keyof T>(type: K): Observable<Subscriber<T[K]>>;
}

export interface IEventBus<T extends object> extends IEventEmitter<T> {
  emit<K extends keyof T>(type: K, payload: T[K]): void;
}
