import { ClassBus, PayloadEvent } from "./class-bus";

class X implements PayloadEvent<number> {
  constructor(public payload: number) {}
}
class Y implements PayloadEvent<string> {
  constructor(public payload: string) {}
}
describe("GenericBus", () => {
  let bus = new ClassBus();
  beforeEach(() => (bus = new ClassBus()));

  it("Filters events by constructor", () => {
    const mock = jest.fn();
    bus.on(X).subscribe(mock);
    bus.emit(new X(10));
    bus.emit(new Y("1234"));
    bus.emit(new X(11));
    expect(mock).toHaveBeenNthCalledWith(1, { payload: 10 });
    expect(mock).toHaveBeenNthCalledWith(2, { payload: 11 });
    expect(mock).toHaveBeenCalledTimes(2);
  });
});
