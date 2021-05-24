import { mergeArraysToObject } from "./merge-arrays-to-objects";

describe("mergeArraysToObjects", () => {
  it("Merges", () => {
    const result = mergeArraysToObject({
      a: [1, 2, 3, 4],
      b: ["1", "2", "3", "4", "5"],
    });
    expect(result.length).toBe(4);
    expect(result[0]).toStrictEqual({ a: 1, b: "2" });
    expect(result[3]).toStrictEqual({ a: 4, b: "5" });
  });
});
