import { Injectable, OnDestroy } from "@angular/core";
import { LogService, UiLogger } from "@pc/angular/logger";
import { CountdownTimer } from "@pc/util";
import { SubSink } from "subsink";
import { IPlatformEvents } from "./token";

@Injectable({ providedIn: "root" })
export class PlatformTimerService implements OnDestroy {
  private subs = new SubSink();
  private timer = new CountdownTimer(50);
  private logger: UiLogger;
  constructor(logService: LogService, serverEvents: IPlatformEvents) {
    this.logger = logService.create("PlatformTimerService");
    this.subs.sink = serverEvents
      .on("liftTimer")
      .subscribe((t) => this.timer.setClock(t));
    serverEvents.request().subscribe();
  }
  get $() {
    return this.timer.$;
  }
  get status$() {
    return this.timer.select("state");
  }
  get remainingMillis$() {
    return this.timer.select("remainingMillis");
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
