import { ILifter } from "./ILifter";
import { IEntity } from "@dt/util";
import { IPlatform } from "./IPlatform";

export interface IGroup {
  name: string;
  competitionId: number;
  platformId?: number;
  weighInTime?: Date;
  competitionTime?: Date;
  platform?: IEntity<IPlatform>;
  lifters?: IEntity<ILifter>[];
}
export type IGroupEntity = IEntity<IGroup>;
