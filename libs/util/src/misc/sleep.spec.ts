import { sleep } from "./sleep";

describe("sleep", () => {
  it("delays execution", async () => {
    const before = Date.now();
    await sleep(30);
    const after = Date.now();
    expect(after - before).toBeGreaterThan(20);
  });
});
