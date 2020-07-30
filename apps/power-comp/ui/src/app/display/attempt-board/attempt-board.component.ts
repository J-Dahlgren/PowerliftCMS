import { Component, OnInit } from "@angular/core";
import { PlatformDecisionService } from "../decision-display/platform-decision.service";
import { Observable } from "rxjs";
import { PlatformDataService, PlatformTimerService } from "../../core";
import { IEntity, Clock } from "@dt/util";
import { LifterData } from "@dt/power-comp/shared";
import { map } from "rxjs/operators";

@Component({
  selector: "pc-attempt-board",
  templateUrl: "./attempt-board.component.html",
  styleUrls: ["./attempt-board.component.scss"]
})
export class AttemptBoardComponent implements OnInit {
  show$: Observable<boolean>;
  current$: Observable<IEntity<LifterData> | null>;
  next$: Observable<IEntity<LifterData> | null>;
  timer$: Observable<Clock>;
  constructor(
    decisionService: PlatformDecisionService,
    platformDataService: PlatformDataService,
    timerService: PlatformTimerService
  ) {
    this.show$ = decisionService.show$;
    this.current$ = platformDataService.select("currentLifter");
    this.next$ = platformDataService.select("nextLifter");
    this.timer$ = timerService.$;
  }

  ngOnInit(): void {}
}
