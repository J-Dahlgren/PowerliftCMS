import { classicCompareFunction } from "./classic-compare-function";
import {
  ILifter,
  createILifter,
  createIAttempt,
  LiftStatus,
} from "../../data-types";
import { nextLifterDeterminator } from "./next-lifter-determinator";

describe("ClassicCompareFunction", () => {
  let A: ILifter;
  let B: ILifter;

  beforeEach(() => {
    A = createILifter({ lot: 1 });
    B = createILifter({ lot: 2 });
  });

  test("sorts on lift type", () => {
    A.lifts.bench = [createIAttempt({ requested: 100 })];
    B.lifts.squat = [createIAttempt({ requested: 100 })];
    expect(classicCompareFunction(A, B)).toBe(1);
  });

  test("sorts on lift weight", () => {
    A.lifts.bench = [createIAttempt({ requested: 100 })];
    B.lifts.bench = [createIAttempt({ requested: 110 })];
    expect(classicCompareFunction(A, B)).toBe(-10);
  });

  test("sorts on attempt index", () => {
    A.lifts.bench = [
      createIAttempt({ requested: 100, status: LiftStatus.SUCCESSFUL }),
      createIAttempt({ automatic: 110 }),
    ];
    B.lifts.bench = [createIAttempt({ requested: 100 }), createIAttempt()];
    expect(classicCompareFunction(A, B)).toBe(1);
  });

  test("sorts on start", () => {
    expect(classicCompareFunction(A, B)).toBe(-1);
  });
});

describe("nextLifterDeterminator", () => {
  let A: ILifter;
  let B: ILifter;
  let C: ILifter;
  let lifters: ILifter[] = [];
  beforeEach(() => {
    A = createILifter({ lot: 1 });
    B = createILifter({ lot: 2 });
    C = createILifter({ lot: 3 });
    lifters = [C, B, A];
  });

  test("No lifters", () => {
    expect(
      nextLifterDeterminator(lifters, classicCompareFunction)
    ).toStrictEqual({
      liftOrder: [A, B, C],
      currentLifter: null,
      nextLifter: null,
    });
  });

  test("Sets B as current, A as next", () => {
    A.lifts.bench = [createIAttempt({ requested: 110 })];
    B.lifts.bench = [createIAttempt({ requested: 100 })];

    expect(
      nextLifterDeterminator(lifters, classicCompareFunction)
    ).toStrictEqual({
      liftOrder: [B, A, C],
      currentLifter: B,
      nextLifter: A,
    });
  });
});
