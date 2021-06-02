import { Component, Input, OnInit } from "@angular/core";
import { AutoUnsubscribeComponent } from "@pc/angular/util";
import { JudgeDecision } from "@pc/power-comp/shared";
import { merge, Observable, of, timer } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { IPlatformEvents } from "../../core";
import { PlatformDecisionService } from "./platform-decision.service";

@Component({
  selector: "pc-decision-display",
  templateUrl: "./decision-display.component.html",
  styleUrls: ["./decision-display.component.scss"],
})
export class DecisionDisplayComponent
  extends AutoUnsubscribeComponent
  implements OnInit {
  @Input() display: boolean = false;

  show$: Observable<boolean>;
  decisions$: Observable<(keyof typeof JudgeDecision)[]>;

  constructor(
    decisions: PlatformDecisionService,
    serverEvents: IPlatformEvents
  ) {
    super();
    this.decisions$ = decisions.$;

    this.show$ = serverEvents
      .on("displayDecisions")
      .pipe(switchMap((t) => merge(of(true), timer(t).pipe(map(() => false)))));
  }

  ngOnInit(): void {}
}
