import { Null, IEntity } from "@pc/util";

/**
 * There are only 2 genders, change my mind
 */
export enum Gender {
  MALE = "m",
  FEMALE = "f"
}
export interface IPerson {
  license?: string | Null;
  fullname?: string;
  firstname: string;
  lastname: string;
  gender: Gender;
  bornYear?: number | Null;
}

export type IPersonEntity = IEntity<IPerson>;
