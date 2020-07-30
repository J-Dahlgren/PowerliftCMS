import { Observable } from "rxjs";
export interface IStateStore<T extends {}> {
  readonly $: Observable<T>;
  state: T;
  select<K extends keyof T>(key: K): Observable<T[K]>;
  get<K extends keyof T>(key: K): T[K];
}
export abstract class AbstractStateStore<T extends {}>
  implements IStateStore<T> {
  abstract get $(): Observable<T>;
  abstract get state(): T;

  abstract select<K extends keyof T>(key: K): Observable<T[K]>;
  get<K extends keyof T>(key: K): T[K] {
    return this.state[key];
  }
}
