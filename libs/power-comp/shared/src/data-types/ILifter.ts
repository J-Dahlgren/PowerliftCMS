import { IPerson } from "./IPerson";
import { ILifts, CompetitionModesEnum, CompetitionModeName } from "./lifts";
import { IGroup } from "./IGroup";
import { IEntity } from "@pc/util";
import { AgeCategoryName } from "./age-category";
import { IWeightClass } from "./weight-category";
import { ILifterSettings } from "./lifter-settings";

export interface ILifter extends IPerson {
  lot: number;
  bodyWeight?: number;
  equipped?: boolean;
  team?: string;
  competitionId: number;
  groupId?: number;
  group?: IGroup;
  ageCategory?: AgeCategoryName | null;
  lifts: ILifts;
  weightCategory?: IWeightClass | null;
  settings: ILifterSettings;
  competitionMode?: CompetitionModeName;
  score?: number;
}
export type ILifterEntity = IEntity<ILifter>;
