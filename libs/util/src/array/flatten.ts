export function flatten<T>(matrix: T[][]) {
  return ([] as T[]).concat.apply([], matrix);
}
