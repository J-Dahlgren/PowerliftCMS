export function mergeArrays<T extends object, DataT extends object>(
  source: T[],
  data: DataT[],
  cutFromStart = true
) {
  const targetLength = Math.min(source.length, data.length);
  const src = shortenArray(targetLength, source, cutFromStart);
  const trgt = shortenArray(targetLength, data, cutFromStart);
  return src.map((item, index) => ({ ...item, ...trgt[index] }));
}

export function shortenArray<T>(
  length: number,
  target: T[],
  cutFromStart = true
) {
  if (length < 0) {
    throw new Error(`Length ${length} not allowed`);
  }
  const trgt = [...target];
  while (trgt.length > length) {
    if (cutFromStart) {
      trgt.shift();
    } else {
      trgt.pop();
    }
  }

  return trgt;
}
