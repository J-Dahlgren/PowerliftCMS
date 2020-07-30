import { ILifter } from "../../data-types";

export type LiftOrderCompareFunction<T extends ILifter> = (
  a: T,
  b: T
) => number;
