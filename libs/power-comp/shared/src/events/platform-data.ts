import { IEntity } from "@pc/util";
import {
  IAttemptInfo,
  JudgeDecision,
  ILifter,
  IGroup,
  Result,
  IResult,
  LifterData,
} from "../data-types";
import { IServerPlatformEvents } from "./server-events";
import { IRank } from "../rules";

// export interface IPlatformData {
//   currentLifter: IEntity<IAttemptInfo> | null;
//   nextLifter: IEntity<IAttemptInfo> | null;
//   ranking: any[];
//   activeGroupId: number | null;
//   decisions: JudgeDecision[];
// }

export type IPlatformData = PersistentPlatformData;

export type PersistentPlatformData = ILifterData & IActiveGroupId;

export interface IActiveGroupId {
  activeGroupId: number | null;
}

export interface ILifterData {
  currentLifter: IEntity<LifterData> | null;
  nextLifter: IEntity<LifterData> | null;
  lifters: IEntity<LifterData & IRank>[];
}
export interface IDecisionData {
  decisions: JudgeDecision[];
}

export class LifterInfo implements ILifterData {
  currentLifter: IEntity<LifterData> | null = null;
  nextLifter: IEntity<LifterData> | null = null;
  lifters: IEntity<LifterData & IRank>[] = [];
}
