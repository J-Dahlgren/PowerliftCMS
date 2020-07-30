import { Gender } from "./IPerson";
import { AgeCategoryName, getAgeCategory } from "./age-category";
import { ILifter } from "./ILifter";

export interface IWeightClass {
  active: boolean;
  minExclusive: number;
  maxInclusive?: number;
  gender: Gender;
  name?: string;
  easyName?: string;
  ageRestriction?: AgeCategoryName[];
}

export function getWeightClass<T extends ILifter, WC extends IWeightClass>(
  lifter: T,
  classes: WC[]
): WC | null {
  const bw = lifter.bodyWeight || -1;
  for (const wClass of classes.filter(c => c.gender === lifter.gender)) {
    const ageCat = getAgeCategory(lifter);

    if (
      wClass.ageRestriction &&
      ageCat &&
      wClass.ageRestriction.indexOf(ageCat.name) < 0
    ) {
      continue; // Lifters age category isn't included in the list of restrictions
    }
    if (
      wClass.minExclusive < bw &&
      (!wClass.maxInclusive || bw <= wClass.maxInclusive)
    ) {
      return wClass;
    }
  }
  return null;
}
