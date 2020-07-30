import { ILifter, competitionModes } from "../data-types";
import { chain } from "lodash";

export function protocolOrder<T extends ILifter>(lifters: T[]): T[] {
  return chain(lifters)
    .sortBy(
      l => l.gender,
      l => l.weightCategory?.minExclusive || 0,
      l => competitionModes.indexOf(l.competitionMode || "SBD"),
      l => l.equipped,
      l => l.lot
    )
    .value();
}
