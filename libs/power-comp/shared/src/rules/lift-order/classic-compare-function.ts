import { LiftOrderCompareFunction } from "./lift-order-compare-function";
import { LiftFieldExt, attemptInfo, ILifter } from "../../data-types";

export const CLASSIC_LIFTS_ORDER: { [key in LiftFieldExt]: number } = {
  squat: 1,
  bench: 2,
  deadlift: 3,
  done: 4,
};

export const classicCompareFunction: LiftOrderCompareFunction<ILifter> = (
  a: ILifter,
  b: ILifter
) => {
  const attA = attemptInfo(a.lifts);
  const attB = attemptInfo(b.lifts);

  if (
    CLASSIC_LIFTS_ORDER[attA.liftName] !== CLASSIC_LIFTS_ORDER[attB.liftName]
  ) {
    return (
      CLASSIC_LIFTS_ORDER[attA.liftName] - CLASSIC_LIFTS_ORDER[attB.liftName]
    );
  }

  if (attA.attemptNumberOneIndexed !== attB.attemptNumberOneIndexed) {
    return attA.attemptNumberOneIndexed - attB.attemptNumberOneIndexed;
  }

  if (attA.weight !== attB.weight) {
    return attA.weight - attB.weight;
  }

  return a.lot - b.lot;
};
