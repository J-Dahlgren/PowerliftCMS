import { mergeArrays, shortenArray } from ".";

describe("mergeIndicators", () => {
  let source: { source: number }[];
  let other: { other: number }[];
  beforeEach(() => {
    source = [1, 2, 3, 4, 5].map((n) => ({ source: n }));
    other = [3, 4, 5].map((n) => ({ other: n }));
  });
  it("shortens left", () => {
    const result = mergeArrays(source, other);
    expect(result.length).toBe(3);
    expect(result[0]).toStrictEqual({ source: 3, other: 3 });
    expect(result.pop()).toStrictEqual({ source: 5, other: 5 });
  });
  it("shortens right", () => {
    const result = mergeArrays(source, other, false);
    expect(result.length).toBe(3);
    expect(result[0]).toStrictEqual({ source: 1, other: 3 });
    expect(result.pop()).toStrictEqual({ source: 3, other: 5 });
  });
});
describe("shortenArray", () => {
  let data: number[];
  beforeEach(() => (data = [1, 2, 3, 4, 5]));
  it("reduces left", () => {
    expect(shortenArray(3, data)).toStrictEqual([3, 4, 5]);
  });
  it("reduces right", () => {
    expect(shortenArray(3, data, false)).toStrictEqual([1, 2, 3]);
  });
  it("doesn't accept lenght < 0", () => {
    expect(() => shortenArray(-1, [])).toThrow();
  });
});
