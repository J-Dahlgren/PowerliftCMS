import { assert } from "chai";
export function toPercent(factor: number, decimals: number = 2): number {
  assert.isAtLeast(decimals, 0);
  return parseFloat(((factor - 1) * 100).toFixed(decimals));
}
export function nthRoot(num: number, root: number): number {
  return Math.pow(num, 1 / root);
}
export function cutDecimal(num: number, decimals: number = 2): number {
  if (num === null || typeof num === "undefined") {
    return 0;
  }
  assert.isAtLeast(decimals, 0);
  return parseFloat(num.toFixed(decimals));
}
export function notNanOrElse(num: number | undefined, fallback: number) {
  if (num === undefined) {
    return fallback;
  }
  return !isNaN(num) && isFinite(num) ? +num : fallback;
}
