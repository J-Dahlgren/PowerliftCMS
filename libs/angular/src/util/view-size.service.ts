import { Injectable } from "@angular/core";
import { from, fromEvent, BehaviorSubject } from "rxjs";
import { map, startWith } from "rxjs/operators";
@Injectable({ providedIn: "root" })
export class ViewSizeService {
  public get width$() {
    return fromEvent<UIEvent>(window, "resize").pipe(
      map(() => window.innerWidth),
      startWith(window.innerWidth)
    );
  }
  public get height$() {
    return fromEvent<UIEvent>(window, "resize").pipe(
      map(() => window.innerHeight),
      startWith(window.innerHeight)
    );
  }
}
