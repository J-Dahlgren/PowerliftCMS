import { StateStore } from "./state-store";
import { distinctUntilChanged } from "rxjs/operators";
import { isEqual } from "lodash";
import { sleep } from "../misc/sleep";

describe("StateStore", () => {
  const initial = { a: 1, b: 2 };
  let store: StateStore<{ a: number; b: number }>;
  beforeEach(() => (store = new StateStore(initial)));
  it("Emits new state", () => {
    store.modify(state => ({ ...state, b: 3 }));
    expect(store.state).toStrictEqual({ a: 1, b: 3 });
  });
  it("Selects partial store observable", done => {
    store.set("a", 10);
    store.select("a").subscribe(n => {
      expect(n).toBe(10);
      done();
    });
  });
  it("Gets partial store value", () => {
    store.modify(state => ({ ...state, b: 10 }));
    expect(store.get("b")).toBe(10);
  });
  it("Updates complete state on any change", async () => {
    const mock = jest.fn();
    store.$.subscribe(state => mock());
    store.modify(() => initial);
    store.modify(() => initial);
    store.set("b", 500);
    store.set("a", 500);
    await sleep(20);
    expect(mock).toBeCalledTimes(3);
  });
});
