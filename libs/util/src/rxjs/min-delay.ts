import { Observable, combineLatest, timer } from "rxjs";
import { delay, map } from "rxjs/operators";

export function minDelay<T>(obs: Observable<T>, delayMillis: number) {
  return combineLatest([obs, timer(delayMillis)]).pipe(map(([o, t]) => o));
}
