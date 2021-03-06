import { Component, OnInit } from "@angular/core";
import { SECOND } from "@pc/util/constants";
import { Clock } from "@pc/util/misc";
import { merge, Observable, of, Subject, timer } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import {
  IPlatformEvents,
  PlatformDataService,
  PlatformTimerService,
} from "../../../core";
import { ClientEventService } from "../client-event.service";

@Component({
  selector: "pc-timekeeper",
  templateUrl: "./timekeeper.component.html",
  styleUrls: ["./timekeeper.component.scss"],
})
export class TimekeeperComponent implements OnInit {
  private timerClicks = new Subject<Clock>();
  activeGroupId$: Observable<number | null>;
  showDecisions$: Observable<boolean>;

  constructor(
    platformDataService: PlatformDataService,
    private clientEventService: ClientEventService,
    serverEvents: IPlatformEvents,
    public timerService: PlatformTimerService
  ) {
    this.timerClicks.subscribe((c) =>
      this.clientEventService.emitEvent("liftTimer", c).subscribe()
    );
    this.activeGroupId$ = platformDataService.select("activeGroupId");
    this.showDecisions$ = serverEvents
      .on("displayDecisions")
      .pipe(switchMap((t) => merge(of(true), timer(t).pipe(map(() => false)))));
  }
  timerClick(c: Clock) {
    this.timerClicks.next(c);
  }
  pause() {
    this.timerClick({ state: "OFF" });
  }
  play() {
    this.timerClick({ state: "ON" });
  }
  reset() {
    this.timerClick({ state: "OFF", remainingMillis: 60 * SECOND });
  }
  ngOnInit() {}
}
