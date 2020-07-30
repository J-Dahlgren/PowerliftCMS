import { LifterData } from "../../data-types";
import { RankCompareFunction, RankSortFunction } from "./rank-compare-function";
import { groupByKeys, extractKeys } from "@dt/util";
import { protocolOrder } from "../protocol-order";

export interface IRank {
  rank?: number;
}
export function getRank<T extends LifterData>(
  lifters: T[],
  rankFn: RankSortFunction<T>
) {
  const groups = groupByKeys(lifters, [
    "gender",
    "weightCategory.name",
    "competitionMode",
    "equipped"
  ]);
  const result: (T & IRank)[] = [];
  for (const groupKey of extractKeys(groups)) {
    const groupLifters = rankFn(groups[groupKey]);
    let rank = 1;
    for (const lifter of groupLifters) {
      if (lifter.result.total) {
        result.push({ ...lifter, rank });
      } else {
        result.push({ ...lifter });
      }
      rank++;
    }
  }
  return protocolOrder(result);
}
