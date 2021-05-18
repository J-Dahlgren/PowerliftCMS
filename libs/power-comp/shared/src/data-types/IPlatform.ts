import { IGroup } from "./IGroup";
import { IEntity } from "@pc/util";
import { ICompetition } from "./ICompetition";

export interface IPlatform {
  name: string;
  competitionId: number;
  weights: IPlatformWeights;
  groups?: IEntity<IGroup>[];
  competition?: IEntity<ICompetition>;
}

export interface IPlatformWeights {
  collarWeight: number;
  barWeight: number;
  plates: IWeightPlate[];
}

export interface IWeightPlate {
  weight: number;
  quantity: number;
}

export type IPlatformEntity = IEntity<IPlatform>;
