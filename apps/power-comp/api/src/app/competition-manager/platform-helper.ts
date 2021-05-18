import { SubscriptionLike } from "@pc/util";

export interface IPlatformHelperService<T extends object>
  extends SubscriptionLike {
  init(context: string, room: string): void;
  getState(): T;
}
