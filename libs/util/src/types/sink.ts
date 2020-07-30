import { SubSink } from "subsink";
import { isArray } from "lodash";
import { SubscriptionLike, ISubSink } from "./idisposable";

export class Sink extends SubSink implements SubscriptionLike {
  constructor() {
    super();
  }
  set s(v: SubscriptionLike | SubscriptionLike[]) {
    const values = isArray(v) ? v : [v];
    for (const sub of values) {
      this.sink = sub;
      if (sub.subs) {
        this.sink = sub.subs;
      }
    }
  }
  unsubscribe() {
    super.unsubscribe();
  }
}
