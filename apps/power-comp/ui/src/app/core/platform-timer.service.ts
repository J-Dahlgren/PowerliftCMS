import { SubSink } from "subsink";
import { OnDestroy, Injectable, Inject } from "@angular/core";
import { LogService, UiLogger } from "@pc/angular/logger";
import { CountdownTimer, InRoom } from "@pc/util";
import { SERVER_EVENTS_TOKEN } from "./token";
import { IServerPlatformEvents } from "@pc/power-comp/shared";

@Injectable({ providedIn: "root" })
export class PlatformTimerService implements OnDestroy {
  private subs = new SubSink();
  private timer = new CountdownTimer(50);
  private logger: UiLogger;
  constructor(
    logService: LogService,
    @Inject(SERVER_EVENTS_TOKEN) serverEvents: InRoom<IServerPlatformEvents>
  ) {
    this.logger = logService.create("PlatformTimerService");
    this.subs.sink = serverEvents
      .on("liftTimer")
      .subscribe(t => this.timer.setClock(t));
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
