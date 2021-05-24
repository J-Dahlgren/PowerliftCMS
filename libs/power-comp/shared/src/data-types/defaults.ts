import { CompetitionModesEnum, ILifts } from "./lifts";
import { IPlatformWeights } from "./IPlatform";
import { generateLiftFields } from "./creators";
import { Gender } from "./IPerson";
import { IWeightClass } from "./weight-category";

export const defaultLifts: {
  [key in keyof typeof CompetitionModesEnum]: ILifts;
} = {
  SBD: generateLiftFields("squat", "bench", "deadlift"),
  B: generateLiftFields("bench"),
};
export const defaultPlatformWeights: IPlatformWeights = {
  collarWeight: 2.5,
  barWeight: 20,
  plates: [
    { weight: 25, quantity: 8 },
    { weight: 20, quantity: 1 },
    { weight: 15, quantity: 1 },
    { weight: 10, quantity: 1 },
    { weight: 5, quantity: 1 },
    { weight: 2.5, quantity: 1 },
    { weight: 1.25, quantity: 1 },
    { weight: 0.5, quantity: 1 },
    { weight: 0.25, quantity: 2 },
  ],
};
export const defaultWeightClasses: IWeightClass[] = [
  // Women
  {
    active: false,
    gender: Gender.FEMALE,
    name: "43",
    minExclusive: 0,
    maxInclusive: 43,
    ageRestriction: ["SUB_JUNIOR", "JUNIOR"],
  },
  {
    active: false,
    gender: Gender.FEMALE,
    name: "47",
    minExclusive: 43,
    maxInclusive: 47,
    ageRestriction: ["SUB_JUNIOR", "JUNIOR"],
  },
  {
    active: true,
    gender: Gender.FEMALE,
    name: "47",
    minExclusive: 0,
    maxInclusive: 47,
  },
  {
    active: true,
    gender: Gender.FEMALE,
    name: "52",
    minExclusive: 47,
    maxInclusive: 52,
  },
  {
    active: true,
    gender: Gender.FEMALE,
    name: "57",
    minExclusive: 52,
    maxInclusive: 57,
  },
  {
    active: true,
    gender: Gender.FEMALE,
    name: "63",
    minExclusive: 57,
    maxInclusive: 63,
  },
  {
    active: true,
    gender: Gender.FEMALE,
    name: "72",
    minExclusive: 63,
    maxInclusive: 72,
  },
  {
    active: true,
    gender: Gender.FEMALE,
    name: "84",
    minExclusive: 72,
    maxInclusive: 84,
  },
  {
    active: true,
    gender: Gender.FEMALE,
    name: "84+",
    minExclusive: 84,
  },
  // Men Sub-junior/junior
  {
    active: false,
    gender: Gender.MALE,
    name: "53",
    minExclusive: 0,
    maxInclusive: 53,
    ageRestriction: ["SUB_JUNIOR", "JUNIOR"],
  },
  {
    active: false,
    gender: Gender.MALE,
    name: "59",
    minExclusive: 53,
    maxInclusive: 59,
    ageRestriction: ["SUB_JUNIOR", "JUNIOR"],
  },

  // Senior
  {
    active: true,
    gender: Gender.MALE,
    name: "59",
    minExclusive: 0,
    maxInclusive: 59,
  },
  {
    active: true,
    gender: Gender.MALE,
    name: "66",
    minExclusive: 59,
    maxInclusive: 66,
  },
  {
    active: true,
    gender: Gender.MALE,
    name: "74",
    minExclusive: 66,
    maxInclusive: 74,
  },
  {
    active: true,
    gender: Gender.MALE,
    name: "83",
    minExclusive: 74,
    maxInclusive: 83,
  },
  {
    active: true,
    gender: Gender.MALE,
    name: "93",
    minExclusive: 83,
    maxInclusive: 93,
  },
  {
    active: true,
    gender: Gender.MALE,
    name: "105",
    minExclusive: 93,
    maxInclusive: 105,
  },
  {
    active: true,
    gender: Gender.MALE,
    name: "120",
    minExclusive: 105,
    maxInclusive: 120,
  },
  {
    active: true,
    gender: Gender.MALE,
    name: "120+",
    minExclusive: 120,
  },
];
