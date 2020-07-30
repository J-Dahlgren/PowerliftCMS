import { DataFrame } from "data-forge";
import { trainTestSplit } from "./train-test-split";
import { multiSplit } from "./multi-split";

describe("trainTestSplit", () => {
  it("Splits", () => {
    const data = new DataFrame({ values: [1, 2, 3, 4, 5] });
    const result = trainTestSplit(data, 80);
    expect(result.train.toArray()).toStrictEqual([1, 2, 3, 4]);
    expect(result.test.toArray()).toStrictEqual([5]);
  });
});
describe("multiSplit", () => {
  const data = new DataFrame({ values: [1, 2, 3, 4, 5, 6, 7, 8, 9] });
  const result = multiSplit(data, 3, 67);
  expect(result[0].train.toArray()).toStrictEqual([1, 2]);
  expect(result[0].test.toArray()).toStrictEqual([3]);
  expect(result[2].train.toArray()).toStrictEqual([7, 8]);
  expect(result[2].test.toArray()).toStrictEqual([9]);
});
