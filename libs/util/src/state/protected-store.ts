import { BehaviorSubject, Observable } from "rxjs";
import { map, distinctUntilChanged, flatMap } from "rxjs/operators";
import { cloneDeep, isEqual } from "lodash";
import { AbstractStateStore } from "./abstract-state-store";
import { extractKeys } from "../types/extract";

type StateFunction<T> = (state: T) => T;
export abstract class ProtectedStore<
  T extends {}
> extends AbstractStateStore<T> {
  protected _state: BehaviorSubject<T>;
  constructor(initialState: T, private distinctChange = true) {
    super();
    this._state = new BehaviorSubject(initialState);
  }
  select<K extends keyof T>(key: K) {
    return this._state.asObservable().pipe(
      map((state) => state[key]),
      distinctUntilChanged((a, b) => this.distinctChange && isEqual(a, b))
    );
  }
  public get $() {
    return this._state.pipe(
      distinctUntilChanged((a, b) => this.distinctChange && isEqual(a, b))
    );
  }
  flat() {
    return this.$.pipe(
      flatMap((state) =>
        extractKeys(state).map((key) => ({ type: key, payload: state[key] }))
      )
    );
  }
  /**
   * Deep clone of the internal state
   */
  public get state(): T {
    return cloneDeep(this._state.value);
  }
  protected modify(func: StateFunction<T>) {
    this._state.next(func(this._state.value));
  }
  protected set<K extends keyof T>(key: K, data: T[K]): this {
    const next = { ...this._state.value };
    next[key] = data;
    this._state.next(next);
    return this;
  }
}
