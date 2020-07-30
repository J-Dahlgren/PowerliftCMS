import { IDataFrame } from "data-forge";
import { assert } from "chai";
export interface TrainTestSplit<T, V> {
  train: IDataFrame<T, V>;
  test: IDataFrame<T, V>;
}
export function trainTestSplit<T, V>(
  data: IDataFrame<T, V>,
  trainPct: number
): TrainTestSplit<T, V> {
  assert.isAbove(trainPct, 0);
  assert.isBelow(trainPct, 100);
  const train = trainPct / 100;
  const length = data.count();
  const trainLength = Math.floor(length * train);
  const testLength = length - trainLength;
  assert.isAbove(trainLength, 0, "Train length can't be 0");
  assert.isAbove(testLength, 0, "Test length can't be 0");
  return {
    train: data.head(trainLength),
    test: data.tail(testLength)
  };
}
