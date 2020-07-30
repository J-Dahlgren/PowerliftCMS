import { SubscriptionLike } from "@dt/util";

export interface IPlatformHelperService<T extends object>
  extends SubscriptionLike {
  init(context: string, room: string): void;
  getState(): T;
}
