import { ExtractEnumKeys } from "@pc/util";

export enum CompetitionModesEnum {
  SBD,
  B,
}
export const competitionModes = ExtractEnumKeys(CompetitionModesEnum);
export type CompetitionModeName = keyof typeof CompetitionModesEnum;
export interface Discipline {
  [index: string]: number;
  squat: 0;
  bench: 1;
  deadlift: 2;
  done: 4;
}
export const DISCIPLINE: { [key in LiftFieldExt]: number } = {
  squat: 0,
  bench: 1,
  deadlift: 2,
  done: 4,
};
export const Disc: {
  [key in LiftFieldExt]: number;
} = {
  squat: 0,
  bench: 1,
  deadlift: 2,
  done: 0,
};
export enum LiftStatus {
  //FAILED_NOT_TAKEN = -2,
  FAILED = -1,
  NOT_ATTEMPTED = 0,
  SUCCESSFUL = 1,
}

export interface IAttempt {
  status: LiftStatus;
  automatic?: number;
  requested?: number;
}
export function requestedWeight(attempt: IAttempt) {
  return attempt.requested || attempt.automatic;
}
export type LiftField = "squat" | "bench" | "deadlift";
export type LiftFieldExt = LiftField | "done";
export const LiftFieldTuple: LiftField[] = ["squat", "bench", "deadlift"];
export const LiftFieldExtTuple: LiftFieldExt[] = [
  "squat",
  "bench",
  "deadlift",
  "done",
];

export type ILifts = {
  [key in LiftField]: IAttempt[];
};
export interface LiftInfo {
  name: keyof ILifts | LiftField;
  attempt: IAttempt;
  attemptNumberOneIndexed: number;
  requestedWeight: number;
}
