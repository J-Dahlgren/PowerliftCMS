import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from "@angular/core";
import {
  PlatformDataService,
  PlatformService,
  GroupService,
  PlatformSelectionService,
  PlatformTimerService,
  SERVER_EVENTS_TOKEN
} from "../../../core";
import { ClientEventService } from "../client-event.service";
import { AutoUnsubscribeComponent } from "@dt/angular/util";

import { SECOND, IEntity, Clock, InRoom } from "@dt/util";
import {
  IGroup,
  IClientPlatformEvents,
  LifterData,
  IServerPlatformEvents
} from "@dt/power-comp/shared";

import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { switchMap, map } from "rxjs/operators";
import { merge, of, Observable, Subject, timer } from "rxjs";

@Component({
  selector: "pc-secretariat-control",
  templateUrl: "./secretariat-control.component.html",
  styleUrls: ["./secretariat-control.component.scss"]
})
export class SecretariatControlComponent extends AutoUnsubscribeComponent
  implements OnInit {
  groups$: Observable<IEntity<IGroup>[]>;
  activeGroupId$: Observable<number | null>;
  currentLifter$: Observable<IEntity<LifterData> | null>;
  private timerClicks = new Subject<Clock>();
  showDecisions$: Observable<boolean>;
  constructor(
    platformDataService: PlatformDataService,
    private platformSelection: PlatformSelectionService,
    @Inject(SERVER_EVENTS_TOKEN) serverEvents: InRoom<IServerPlatformEvents>,
    public timerService: PlatformTimerService,
    groupService: GroupService,
    private clientEventService: ClientEventService
  ) {
    super();
    this.activeGroupId$ = platformDataService.select("activeGroupId");

    this.showDecisions$ = serverEvents
      .on("displayDecisions")
      .pipe(switchMap(t => merge(of(true), timer(t).pipe(map(() => false)))));

    this.groups$ = this.platformSelection.select("selectedPlatform").pipe(
      switchMap(platform =>
        groupService.getMany(
          RequestQueryBuilder.create({
            filter: {
              field: "platformId",
              operator: "eq",
              value: platform?.id || -1
            }
          }).query()
        )
      )
    );
    this.currentLifter$ = platformDataService.select("currentLifter");
    this.timerClicks.subscribe(c =>
      this.clientEventService.emitEvent("liftTimer", c).subscribe()
    );
  }
  selectGroup(id: IClientPlatformEvents["activeGroupId"]) {
    this.clientEventService.emitEvent("activeGroupId", id).subscribe();
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
  decisionReset() {
    for (let i = 0; i < 3; i++) {
      this.clientEventService
        .emitEvent("decision", { d: "NOT_DECIDED", judgeNumber: i + 1 })
        .subscribe();
    }
  }
  decision(d: boolean) {
    this.clientEventService.emitEvent("secretariatDecision", d).subscribe();
  }
  ngOnInit(): void {}
}
