import { ILifts, CompetitionModesEnum, CompetitionModeName } from "./lifts";
import { ILifter } from "./ILifter";
import { defaultLifts } from "./defaults";
import { extractKeys } from "@pc/util";

export function matchLiftConfiguration(
  lifts: ILifts,
  mode: keyof typeof CompetitionModesEnum
) {
  const targetMatch = defaultLifts[mode];
  return !extractKeys(targetMatch).some(
    (key) => lifts[key].length !== targetMatch[key].length
  );
}

export function matchesAnyLiftConfig(
  lifts: ILifts
): CompetitionModeName | null {
  for (const key of extractKeys(defaultLifts)) {
    if (matchLiftConfiguration(lifts, key)) {
      return key;
    }
  }
  return null;
}
