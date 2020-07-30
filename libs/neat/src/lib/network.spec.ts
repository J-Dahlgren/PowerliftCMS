import { Network } from "neataptic";

describe("Network", () => {
  it("should create instance of Network", () => {
    const network = new Network(2, 2);
    expect(network).toBeInstanceOf(Network);
    expect(network.input).toBe(2);
  });
});
