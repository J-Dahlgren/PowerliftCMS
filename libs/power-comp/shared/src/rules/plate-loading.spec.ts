import { defaultPlatformWeights } from "../data-types/defaults";
import { findValidPlateCombo } from "./plate-loading";
import { IPlatformWeights } from "../data-types";

describe("Plate loading", () => {
  test("Find best valid loading", () => {
    expect(plateFn(150)).toStrictEqual([25, 25, 10, 2.5]);
    expect(plateFn(64)).toStrictEqual([15, 2.5, 1.25, 0.5, 0.25]);
  });
});
function plateFn(
  weight: number,
  weights: IPlatformWeights = defaultPlatformWeights
) {
  return findValidPlateCombo(
    (weight - 20) / 2 - weights.collarWeight, // (Weight - bar) - collars
    weights.plates
  ).map((p) => p.weight);
}
