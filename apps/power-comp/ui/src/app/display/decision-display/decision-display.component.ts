import { Component, OnInit, Input, Inject } from "@angular/core";
import { BehaviorSubject, Observable, scheduled, of, timer, merge } from "rxjs";
import { JudgeDecision, IServerPlatformEvents } from "@pc/power-comp/shared";
import { SERVER_EVENTS_TOKEN } from "../../core";
import { InRoom, lodashChainMap } from "@pc/util";
import { AutoUnsubscribeComponent } from "@pc/angular/util";
import {
  exhaustMap,
  switchMap,
  concatMapTo,
  mergeAll,
  map
} from "rxjs/operators";
import { PlatformDecisionService } from "./platform-decision.service";

@Component({
  selector: "pc-decision-display",
  templateUrl: "./decision-display.component.html",
  styleUrls: ["./decision-display.component.scss"]
})
export class DecisionDisplayComponent extends AutoUnsubscribeComponent
  implements OnInit {
  @Input() display: boolean = false;

  show$: Observable<boolean>;
  decisions$: Observable<(keyof typeof JudgeDecision)[]>;

  constructor(
    decisions: PlatformDecisionService,
    @Inject(SERVER_EVENTS_TOKEN) serverEvents: InRoom<IServerPlatformEvents>
  ) {
    super();
    this.decisions$ = decisions.$;

    this.show$ = serverEvents
      .on("displayDecisions")
      .pipe(switchMap(t => merge(of(true), timer(t).pipe(map(() => false)))));
  }

  ngOnInit(): void {}
}
