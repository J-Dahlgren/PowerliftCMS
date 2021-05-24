import { map } from "rxjs/operators";
import { IEvent } from "../event-bus";
import { flatMap } from "rxjs/operators";
import { ObservableInput } from "rxjs";
import { chain, CollectionChain } from "lodash";
import { extractKeys } from "../types/extract";

type compareFn<T> = (a: T, b: T) => number;
export function filterMap<T>(predicate: (value: T) => boolean) {
  return map<T[], T[]>((values) => values.filter(predicate));
}

export function lodashChainMap<InputT, ResultT>(
  chainFn: (
    collectionChain: CollectionChain<InputT>
  ) => CollectionChain<ResultT>
) {
  return map<InputT[], ResultT[]>((values) => chainFn(chain(values)).value());
}

export function flattenToEvent<T extends {}>() {
  return flatMap<T, ObservableInput<IEvent<T>>>((state) =>
    extractKeys(state).map((key) => ({ type: key, payload: state[key] }))
  );
}
export function sortMap<T>(comparator: compareFn<T>) {
  return map<T[], T[]>((values) => values.sort(comparator));
}
