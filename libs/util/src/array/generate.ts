export function generateArray(count: number, startIndex = 1) {
  return Array.from(Array(count), (_, i) => i + startIndex);
}
