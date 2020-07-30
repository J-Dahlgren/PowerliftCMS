import { cloneDeep } from "lodash";
import { BehaviorSubject } from "rxjs";

export class RollingList<T> {
  private _list: T[] = [];
  public _data = new BehaviorSubject<T[]>([]);
  constructor(private capacity: number) {
    if (capacity < 1) {
      throw new Error("Capacity can't be below 1");
    }
  }
  public $() {
    return this._data.asObservable();
  }
  add(...items: T[]) {
    this._list.push(...items);
    this.shift();
  }
  list(clone = true) {
    if (clone) {
      return cloneDeep(this._list);
    }
    return this._list;
  }
  private shift() {
    while (this._list.length > this.capacity) {
      this._list.shift();
    }
    this._data.next(this._list);
  }
}
