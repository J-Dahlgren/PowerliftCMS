import { RankCompareFunction } from "./rank-compare-function";
import {
  LifterData,
  LiftFieldTuple,
  LiftStatus,
  ILifter
} from "../../data-types";
import moment from "moment";
import { IRank } from "./rank";
import { chain, orderBy } from "lodash";

export function classicRankFn<T extends LifterData>(a: T, b: T): number {
  if (a.result.total !== b.result.total) {
    return b.result.total - a.result.total; // Higher better
  }

  const now = Date.now();
  const aDate = moment(a.group?.competitionTime || now).valueOf();
  const bDate = moment(b.group?.competitionTime || now).valueOf();

  if (aDate !== bDate) {
    return aDate - bDate; // Lower better
  }

  if (a.bodyWeight !== b.bodyWeight) {
    return (a.bodyWeight || 0) - (b.bodyWeight || 0); // Lower better
  }

  const aAttemptForTotal = attemptNumberForTotal(a);
  const bAttemptForTotal = attemptNumberForTotal(b);

  if (aAttemptForTotal !== bAttemptForTotal) {
    return aAttemptForTotal - bAttemptForTotal; // Lower better
  }

  return a.lot - b.lot; // Lower better
}

export function classicRankSort<T extends LifterData>(lifters: T[]) {
  const now = Date.now();
  return orderBy(
    lifters,
    [
      l => l.result.total,
      l => moment(l.group?.competitionTime || now).valueOf(),
      l => l.bodyWeight || Number.MAX_SAFE_INTEGER,
      l => attemptNumberForTotal(l),
      l => l.lot
    ],
    ["desc", "asc", "asc", "asc", "asc"]
  );
}

export function attemptNumberForTotal<T extends LifterData>(lifter: T): number {
  let attemptNumber = 0;

  if (lifter.result.total <= 0) {
    return Number.MAX_SAFE_INTEGER;
  }
  let total = 0;
  for (const field of LiftFieldTuple) {
    let best = 0;
    for (const attempt of lifter.lifts[field]) {
      attemptNumber++;
      if (attempt.status === LiftStatus.SUCCESSFUL) {
        best = attempt.requested || attempt.automatic || 0;
      }
      if (total + best === lifter.result.total) {
        return attemptNumber;
      }
    }
    total += best;
  }
  return Number.MAX_SAFE_INTEGER;
}
