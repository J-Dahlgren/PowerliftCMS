import { ILifter, LifterData } from "../../data-types";

export type RankCompareFunction<T extends LifterData> = (a: T, b: T) => number;
export type RankSortFunction<T extends LifterData> = (lifters: T[]) => T[];
