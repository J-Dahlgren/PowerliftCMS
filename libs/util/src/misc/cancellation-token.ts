export interface ICancelToken {
  readonly isCanceled: boolean;
  throwIfRequested(): void;
}
export class CancelToken implements ICancelToken {
  protected cancellationReason?: string;
  constructor() {}
  isCanceled: boolean = false;
  cancel(reason?: string) {
    if (reason) {
      this.cancellationReason = reason;
    }
    this.isCanceled = true;
  }
  throwIfRequested(): void {
    if (this.isCanceled) {
      const reason = this.cancellationReason || "none";
      throw new Error(`Cancellation requested, reason: ${reason}`);
    }
  }
  public static get NONE(): ICancelToken {
    return {
      isCanceled: false,
      throwIfRequested: () => {}
    };
  }
}
