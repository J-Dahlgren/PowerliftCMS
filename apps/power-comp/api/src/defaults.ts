import {
  ICompetition,
  defaultPlatformWeights,
  ILifter,
  createILifter,
  generateLiftFields,
  LiftFieldTuple,
  LiftStatus,
  defaultWeightClasses
} from "@dt/power-comp/shared";
import { names, groups } from "./generated";
import { extractKeys } from "@dt/util";

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateLifts() {
  const lifts = generateLiftFields(...LiftFieldTuple);
  for (const key of extractKeys(lifts)) {
    lifts[key][0] = {
      status: LiftStatus.NOT_ATTEMPTED,
      requested:
        randomIntFromInterval(80, 250) + (Math.round(Math.random()) ? 0.5 : 0)
    };
  }
  return { lifts };
}
const lifters: ILifter[] = names.map(person =>
  createILifter({
    ...(person as Partial<ILifter>),
    ...generateLifts(),
    bornYear: randomIntFromInterval(1970, 2005)
  })
);

export const competitionDefaults = {
  name: "SM",
  weightCategories: defaultWeightClasses,
  lifters,
  groups,
  platforms: [
    {
      name: "P1",
      weights: defaultPlatformWeights,
      competitionId: 1
    },
    {
      name: "P2",
      weights: defaultPlatformWeights,
      competitionId: 1
    }
  ]
};
