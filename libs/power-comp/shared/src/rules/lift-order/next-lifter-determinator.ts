import { LiftOrderCompareFunction } from "./lift-order-compare-function";
import { ILifter, attemptInfo } from "../../data-types";
import { IEntity } from "@pc/util";

export function nextLifterDeterminator<T extends ILifter>(
  lifters: T[],
  comparator: LiftOrderCompareFunction<T>
) {
  const sorted = lifters.sort(comparator);
  const filtered = sorted.filter(
    lifter => attemptInfo(lifter.lifts).liftName !== "done"
  );
  return {
    liftOrder: sorted,
    currentLifter: (filtered[0] || null) as T | null,
    nextLifter: (filtered[1] || null) as T | null
  };
}
