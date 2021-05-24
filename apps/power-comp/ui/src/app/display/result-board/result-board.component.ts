import { Component, OnInit } from "@angular/core";
import { PlatformDataService } from "../../core";
import {
  IRank,
  LifterData,
  LiftFieldTuple,
  protocolOrder,
} from "@pc/power-comp/shared";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { IEntity } from "@pc/util";

@Component({
  selector: "pc-result-board",
  templateUrl: "./result-board.component.html",
  styleUrls: ["./result-board.component.scss"],
})
export class ResultBoardComponent implements OnInit {
  liftFields = LiftFieldTuple;
  columns = [
    "lot",
    "fullname",
    "team",
    "category",
    "competitionMode",
    ...this.liftFields,
    "total",
    "rank",
    "score",
  ];
  lifters$: Observable<(LifterData & IRank)[]>;
  current$: Observable<IEntity<LifterData> | null>;
  next$: Observable<IEntity<LifterData> | null>;
  constructor(platformDataService: PlatformDataService) {
    this.current$ = platformDataService.select("currentLifter");
    this.next$ = platformDataService.select("nextLifter");
    this.lifters$ = platformDataService
      .select("lifters")
      .pipe(map(protocolOrder));
  }

  ngOnInit(): void {}
}
