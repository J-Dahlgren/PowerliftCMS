import {
  LiftFieldExt,
  LiftFieldTuple,
  LiftStatus,
  ILifts,
  requestedWeight
} from "./lifts";
export interface IAttemptInfo {
  liftName: LiftFieldExt;
  attemptNumberOneIndexed: number;
  weight: number;
}
export class AttemptInfo implements IAttemptInfo {
  constructor(initial: Partial<AttemptInfo> = {}) {
    Object.assign(this, initial);
  }
  liftName: LiftFieldExt = "done";
  attemptNumberOneIndexed = 0;
  weight = 0;
}
export function attemptInfo(lifts: ILifts) {
  for (const field of LiftFieldTuple) {
    // Enforce order of keys
    const arr = lifts[field];
    for (let i = 0; i < arr.length; i++) {
      const attempt = arr[i];
      if (
        attempt.status === LiftStatus.NOT_ATTEMPTED &&
        !!requestedWeight(attempt)
      ) {
        return new AttemptInfo({
          weight: requestedWeight(attempt),
          liftName: field,
          attemptNumberOneIndexed: i + 1
        });
      }
    }
  }
  return new AttemptInfo();
}
