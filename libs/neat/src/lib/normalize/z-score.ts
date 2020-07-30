export function zScore(x: number, mean: number, stddev: number) {
  if (stddev === 0) {
    return x >= 0 ? Number.MAX_SAFE_INTEGER : -Number.MAX_SAFE_INTEGER;
  }
  return (x - mean) / stddev;
}
