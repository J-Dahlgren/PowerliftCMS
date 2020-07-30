import { DataFrame, IDataFrame } from "data-forge";
import { assert } from "chai";
import { TrainTestSplit, trainTestSplit } from "./train-test-split";

export function multiSplit<V>(
  data: IDataFrame<number, V>,
  blockCount: number,
  trainPct: number
): TrainTestSplit<number, V>[] {
  assert.isAbove(blockCount, 0);
  assert.isBelow(blockCount, data.count());
  const blockLength = Math.floor(data.count() / blockCount);
  const totalLength = blockCount * blockLength;
  const result: TrainTestSplit<number, V>[] = [];
  for (let i = 0; i < totalLength; i += blockLength) {
    const start = i;
    const end = i + blockLength - 1;
    const block = trainTestSplit(data.between(start, end), trainPct);
    result.push(block);
  }
  return result;
}
