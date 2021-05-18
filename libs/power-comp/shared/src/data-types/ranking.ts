import { LiftField, IAttempt, LiftStatus } from "./lifts";
import { extractKeys } from "@pc/util";
import { ILifter } from "./ILifter";
export interface IResult {
  result: Result;
}
export type Result = {
  [key in LiftField]: number;
} & { total: number };

export function getResult(lifter: ILifter): Result {
  const result = { total: 0 } as Result;
  for (const key of extractKeys(lifter.lifts)) {
    result[key] = getBestOfLifts(lifter.lifts[key]);
    result.total += result[key];
  }
  return result;
}
export function getBestOfLifts(attempts: IAttempt[]) {
  const liftedWeights = attempts
    .filter(a => a.status === LiftStatus.SUCCESSFUL)
    .map(a => a.requested || a.automatic || 0);

  return Math.max(...liftedWeights, 0);
}
