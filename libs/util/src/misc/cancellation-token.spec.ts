import { CancelToken } from "./cancellation-token";

describe("CancelToken", () => {
  it("Gets canceled", () => {
    const token = new CancelToken();
    token.cancel();
    expect(token.isCanceled).toBe(true);
  });
  it("Throws when requested", () => {
    const token = new CancelToken();
    expect(() => token.throwIfRequested()).not.toThrow();
    token.cancel();
    expect(() => token.throwIfRequested()).toThrow();
  });
});
