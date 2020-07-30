export interface ISubSink {
  readonly subs?: SubscriptionLike;
}
export interface SubscriptionLike extends ISubSink {
  unsubscribe(): void;
}
