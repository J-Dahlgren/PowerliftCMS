import { ILifter } from "./ILifter";
import { ILifts, IAttempt, LiftStatus, LiftField } from "./lifts";
import { Gender } from "./IPerson";
import { IEntity } from "@pc/util";
import { attemptInfo, IAttemptInfo } from "./attempt-info";
import { Result, getResult, IResult } from "./ranking";
import { LifterData } from "./lifter-data";
import { ILifterSettings } from "./lifter-settings";

export function createILifter(initial: Partial<ILifter> = {}): ILifter {
  return {
    settings: createSettings(initial?.settings),
    firstname: "",
    lastname: "",
    lot: 0,
    competitionId: 0,
    gender: Gender.MALE,
    lifts: createILifts(),
    ...initial,
  };
}
export function createSettings(
  initial: Partial<ILifterSettings> = {}
): ILifterSettings {
  return { squat: {}, bench: {}, ...initial };
}
export function mergeLifterAttempt(
  lifter: IEntity<ILifter>
): IEntity<ILifter & IAttemptInfo> {
  return { ...lifter, ...attemptInfo(lifter.lifts) };
}

export function getCompleteLifterInfo(
  lifter: IEntity<ILifter>
): IEntity<LifterData> {
  return {
    ...lifter,
    attemptInfo: attemptInfo(lifter.lifts),
    result: getResult(lifter),
  };
}

export function createILifts(initial: Partial<ILifts> = {}): ILifts {
  return { squat: [], bench: [], deadlift: [], ...initial };
}
export function createIAttempt(initial: Partial<IAttempt> = {}): IAttempt {
  return { status: LiftStatus.NOT_ATTEMPTED, ...initial };
}
export function generateLiftFields(...config: LiftField[]): ILifts {
  const fields = createILifts();
  config.forEach((field) => (fields[field] = generateLifts(3)));
  return fields;
}
export function generateLifts(count: number): IAttempt[] {
  if (count < 1) {
    return [];
  }
  const attempts: IAttempt[] = [];
  for (let i = 0; i < count; i++) {
    attempts.push(createIAttempt());
  }
  return attempts;
}
