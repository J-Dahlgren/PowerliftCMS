import { ExtractEnumKeys, extractKeys } from "@dt/util";
import { ILifter } from "./ILifter";

export enum AgeCategoryEnum {
  SUB_JUNIOR,
  JUNIOR,
  MASTERS_1,
  MASTERS_2,
  MASTERS_3,
  MASTERS_4
}

export interface AgeCategory<K extends keyof typeof AgeCategoryEnum> {
  name: K;
  maxAge: number;
  minAge: number;
}
export type AgeCategoryName = keyof typeof AgeCategoryEnum;
export const AgeCategories = ExtractEnumKeys(AgeCategoryEnum);
export const defaultAgeCategories: {
  [key in AgeCategoryName]: AgeCategory<key>;
} = {
  SUB_JUNIOR: {
    name: "SUB_JUNIOR",
    minAge: 15,
    maxAge: 18
  },
  JUNIOR: {
    name: "JUNIOR",
    minAge: 19,
    maxAge: 23
  },
  MASTERS_1: {
    name: "MASTERS_1",
    minAge: 40,
    maxAge: 49
  },
  MASTERS_2: {
    name: "MASTERS_2",
    minAge: 50,
    maxAge: 59
  },
  MASTERS_3: {
    name: "MASTERS_3",
    minAge: 60,
    maxAge: 69
  },
  MASTERS_4: {
    name: "MASTERS_4",
    minAge: 70,
    maxAge: Number.MAX_SAFE_INTEGER
  }
};

export function getAgeCategory<T extends ILifter>(
  athlete: T
): AgeCategory<AgeCategoryName> | null {
  const bornYear = athlete.bornYear || new Date().getFullYear();
  const ageYear = new Date().getFullYear() - bornYear;
  for (const key of extractKeys(defaultAgeCategories)) {
    const cat = defaultAgeCategories[key];
    if (cat.minAge <= ageYear && ageYear <= cat.maxAge) {
      return cat;
    }
  }
  return null; // Default
}
