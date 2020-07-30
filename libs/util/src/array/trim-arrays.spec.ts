import { trimArrays } from "./trim-arrays";

describe("trimArrays", () => {
  it("Trims perfectly", () => {
    const result1 = trimArrays({ a: [1, 2, 3, 4, 5], b: [2, 3, 4] });
    expect(result1.a.length).toBe(3);
    expect(result1.b.length).toBe(3);
    const result2 = trimArrays({ a: [1, 2, 3, 4, 5], b: [2, 3, 4] }, false);
    expect(result2.a[2]).toBe(3);
    expect(result2.b.length).toBe(3);
  });
});
