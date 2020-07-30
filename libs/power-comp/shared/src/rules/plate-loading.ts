import { IWeightPlate, IPlatformWeights } from "../data-types";

export function getPlateLoading(weight: number, weights: IPlatformWeights) {
  return findValidPlateCombo(
    (weight - 20) / 2 - weights.collarWeight, // (Weight - bar) - collars
    weights.plates
  );
}

export function findValidPlateCombo(
  target: number,
  plates: IWeightPlate[]
): IWeightPlate[] {
  const nums: IWeightPlate[] = [];
  const result: IWeightPlate[] = [];

  for (const plate of plates) {
    for (let i = 0; i < plate.quantity; i++) {
      nums.push(plate);
    }
  }
  for (let i = 0; i < nums.length; i++) {
    const nextSum = nums.slice(0, i + 1).reduce(sum, 0);
    if (nextSum < target) {
      continue;
    }
    const res = getUniqueCombos(i + 1, nums, target);
    if (res.length && res[0].length) {
      return res[0];
    }
  }
  return result;
}
export function getUniqueCombos(
  take: number,
  arr: IWeightPlate[],
  remainingSum: number
) {
  if (take <= 0 || !Array.isArray(arr) || remainingSum <= 0) {
    return [];
  }
  const combos: IWeightPlate[][] = [];
  for (let i = 0; i < arr.length - take + 1; i++) {
    const arrCopy = [...arr].slice(i, arr.length);

    if (take === 1 && arrCopy[0].weight < remainingSum) {
      break;
    }
    if (arrCopy.reduce<number>(sum, 0) < remainingSum) {
      break;
    }

    const taken = arrCopy.splice(0, 1);
    const current = taken[0];

    const res = getUniqueCombos(
      take - 1,
      arrCopy,
      remainingSum - current.weight
    );

    if (res.length > 0) {
      for (const r of res) {
        if (
          [current, ...r].reduce(sum, 0) === remainingSum &&
          r.length === take - 1
        ) {
          combos.push([current, ...r]);
          return combos;
        }
      }
    } else if (current.weight === remainingSum) {
      combos.push(taken);
      return combos;
    }
  }
  return combos;
}
function sum(total: number, plate: IWeightPlate): number {
  return total + plate.weight;
}
