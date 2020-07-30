import { EventBus } from "./event-bus";
import { Observer } from "rxjs";
interface TestEventList {
  a: number;
  b: string;
}
describe("EventBus", () => {
  let bus: EventBus<TestEventList>;
  beforeEach(() => (bus = new EventBus()));
  test("Emits events of correct type", done => {
    bus.on("a").subscribe(event => {
      expect(typeof event).toEqual("number");
      expect(event).toBe(10);
      done();
    });
    bus.emit("a", 10);
  });
  test("Request", done => {
    bus.onRequest("b").subscribe(res => {
      res.next("response");
      res.complete();
    });
    bus.request("b").subscribe(response => {
      expect(response).toBe("response");
      done();
    });
  }, 200);
  test("Request times out", done => {
    bus.request("b", 50).subscribe(
      () => {},
      error => {
        done();
      }
    );
  }, 100);
  test("Listens to all", () => {
    const mock = jest.fn();
    bus.onAny().subscribe(mock);
    bus.emit("a", 10);
    bus.emit("b", "abc");
    expect(mock).toHaveBeenNthCalledWith(1, { type: "a", payload: 10 });
    expect(mock).toHaveBeenNthCalledWith(2, { type: "b", payload: "abc" });
  });
});
