import { classicCompareFunction } from "./classic-compare-function";
import { LiftOrderCompareFunction } from "./lift-order-compare-function";
import { CompetitionModesEnum, ILifter } from "../../data-types";

type liftOrderFunctions = {
  [key in keyof typeof CompetitionModesEnum]: LiftOrderCompareFunction<ILifter>;
};
export const LiftOrderFunctions: liftOrderFunctions = {
  SBD: classicCompareFunction,
  B: classicCompareFunction
};
