import { Attempt } from "./attempt";
import { Lifts } from "./lift";
import { attemptInfo, AttemptInfo, LiftStatus } from "@dt/power-comp/shared";

describe("Attempt", () => {
  test("requestedWeight()", () => {
    const attempt = new Attempt();
    expect(attempt.requestedWeight()).toBeUndefined();
    attempt.automatic = 1;
    expect(attempt.requestedWeight()).toBe(1);
    attempt.requested = 2;
    expect(attempt.requestedWeight()).toBe(2);
  });
});
describe("Lifts", () => {
  test("default attemptInfo", () => {
    const lifts = new Lifts();
    const info = attemptInfo(lifts);
    expect(info).toStrictEqual(new AttemptInfo());
  });
  test("attemptInfo", () => {
    const lifts = new Lifts();
    lifts.squat = [new Attempt({ requested: 1 })];
    const info = attemptInfo(lifts);
    expect(info).toStrictEqual(
      new AttemptInfo({
        liftName: "squat",
        attemptNumberOneIndexed: 1,
        weight: 1
      })
    );
  });
  test("requestedWeight", () => {
    const lifts = new Lifts();
    lifts.squat = [new Attempt({ requested: 1 })];
    const attempt = lifts.requestedWeight("squat");
    expect(attempt).toBeDefined();
    if (!attempt) throw new Error();
    expect(attempt.status).toBe(LiftStatus.NOT_ATTEMPTED);
    expect(attempt.requested).toBe(1);
  });
});
