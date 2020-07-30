import { IPlatform } from "./IPlatform";
import { IGroup } from "./IGroup";
import { ILifter } from "./ILifter";
import { IEntity } from "@dt/util";
import { IWeightClass } from "./weight-category";

export interface ICompetition {
  name: string;
  city?: string;
  location?: string;
  active?: boolean;
  platforms: IEntity<IPlatform>[];
  groups: IEntity<IGroup>[];
  lifters: IEntity<ILifter>[];
  weightCategories: IEntity<IWeightClass>[];
}
export type ICompetitionEntity = IEntity<ICompetition>;
