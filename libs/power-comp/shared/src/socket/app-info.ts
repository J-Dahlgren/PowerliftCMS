import { IEntity } from "@pc/util";
import { ICompetition, IPlatform } from "../data-types";

export interface IAppInfo {
  requireAuthentication?: boolean;
  ipAdresses: string[];
  competitions: IEntity<ICompetition>[];
  platforms: IEntity<IPlatform>[];
  languageRestriction?: string;
}
export class AppInfo implements IAppInfo {
  competitions: IEntity<ICompetition>[] = [];
  platforms: IEntity<IPlatform>[] = [];
  ipAdresses: string[] = [];
  constructor(initial: Partial<AppInfo> = {}) {
    Object.assign(this, initial);
  }
}
