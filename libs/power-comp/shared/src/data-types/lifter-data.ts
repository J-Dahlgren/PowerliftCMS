import { IAttemptInfo } from "./attempt-info";
import { IResult } from "./ranking";
import { ILifter } from "./ILifter";

export type LifterData = ILifter & IResult & { attemptInfo: IAttemptInfo };
