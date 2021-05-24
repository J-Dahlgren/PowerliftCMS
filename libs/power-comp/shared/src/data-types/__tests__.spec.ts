import { LiftStatus, ILifts, requestedWeight, IAttempt } from "./lifts";
import { AttemptInfo, attemptInfo } from "./attempt-info";
import { createIAttempt, createILifter, createILifts } from "./creators";
import {
  JudgeDecision,
  majorityApprove,
  allHasDecided,
  majorityHasDecided,
} from "./decision";
import { getBestOfLifts, getResult } from "./ranking";

describe("Attempt", () => {
  test("requestedWeight()", () => {
    const attempt: IAttempt = createIAttempt();
    expect(requestedWeight(attempt)).toBeUndefined();
    attempt.automatic = 1;
    expect(requestedWeight(attempt)).toBe(1);
    attempt.requested = 2;
    expect(requestedWeight(attempt)).toBe(2);
  });
});

describe("Lifts", () => {
  let lifts: ILifts;
  beforeEach(() => (lifts = { bench: [], squat: [], deadlift: [] }));
  test("default attemptInfo", () => {
    const info = attemptInfo(lifts);
    expect(info).toStrictEqual(new AttemptInfo());
  });
  test("attemptInfo", () => {
    lifts.squat = [
      createIAttempt({ status: LiftStatus.SUCCESSFUL, requested: 1 }),
      createIAttempt({ automatic: 2 }),
    ];
    const info = attemptInfo(lifts);
    expect(info).toStrictEqual(
      new AttemptInfo({
        liftName: "squat",
        attemptNumberOneIndexed: 2,
        weight: 2,
      })
    );
  });
});

describe("Decision", () => {
  const dec1: JudgeDecision[] = [0, 0, 1];
  const dec2: JudgeDecision[] = [0, 1, 1];
  const dec3: JudgeDecision[] = [2, 2, 1];
  const dec4: JudgeDecision[] = [0, 2, 1];
  test("majorityApprove", () => {
    expect(majorityApprove(dec1)).toBeFalsy();
    expect(majorityApprove(dec2)).toBeTruthy();
  });

  test("allHasDecided", () => {
    expect(allHasDecided(dec3)).toBeTruthy();
    expect(allHasDecided(dec2)).toBeFalsy();
    expect(allHasDecided([])).toBeFalsy();
  });

  test("majorityHasDecided", () => {
    expect(majorityHasDecided(dec4)).toBeTruthy();
    expect(majorityHasDecided(dec1)).toBeFalsy();
  });
});

describe("creator functions", () => {
  test("createILifter()", () => {
    expect(createILifter().firstname).toBe("");
  });
  test("createIAttempt()", () => {
    expect(createIAttempt({ status: LiftStatus.SUCCESSFUL }).status).toBe(
      LiftStatus.SUCCESSFUL
    );
  });
});

describe("result", () => {
  const attempts = [
    createIAttempt({ status: LiftStatus.SUCCESSFUL, requested: 1 }),
    createIAttempt({ status: LiftStatus.FAILED, automatic: 3 }),
    createIAttempt({
      status: LiftStatus.SUCCESSFUL,
      automatic: 3,
      requested: 4,
    }),
    createIAttempt({ status: LiftStatus.SUCCESSFUL }),
  ];
  test("getBestOfLifts", () => {
    expect(getBestOfLifts(attempts)).toEqual(4);
    expect(getBestOfLifts([createIAttempt(), createIAttempt()])).toEqual(0);
  });
  test("createResult", () => {
    const lifts = createILifts({ squat: attempts, bench: attempts });

    const result = getResult(createILifter({ lifts }));

    expect(result.total).toEqual(8);
    expect(result.squat).toEqual(4);
    expect(result.bench).toEqual(4);
    expect(result.deadlift).toEqual(0);
  });
});
