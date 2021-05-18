import { OnDestroy } from "@angular/core";
import { SubSink } from "subsink";

export abstract class AutoUnsubscribeComponent implements OnDestroy {
  protected subs = new SubSink();

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
