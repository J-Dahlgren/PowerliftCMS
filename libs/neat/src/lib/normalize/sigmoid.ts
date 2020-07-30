export function sigmoid(value: number, max: number = 2): number {
  const input = (value * 2) / max;
  return 1 / (1 + Math.exp(-input));
}
