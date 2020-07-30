import { Component, OnInit } from "@angular/core";
import { PlatformDataService } from "../../core";
import { Observable } from "rxjs";
import {
  LifterData,
  LiftFieldExtTuple,
  DISCIPLINE,
  IAttemptInfo
} from "@dt/power-comp/shared";
import { AutoUnsubscribeComponent } from "@dt/angular/util";
import { lodashChainMap } from "@dt/util";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "pc-lift-order",
  templateUrl: "./lift-order.component.html",
  styleUrls: ["./lift-order.component.scss"]
})
export class LiftOrderComponent extends AutoUnsubscribeComponent
  implements OnInit {
  columns = ["lot", "fullname", "team", "category", "attempt", "weight"];
  attemptGroups: string[] = [];
  lifters$: Observable<LifterData[]>;
  constructor(platformDataService: PlatformDataService) {
    super();
    this.lifters$ = platformDataService.select("lifters");
    this.subs.sink = this.lifters$
      .pipe(
        lodashChainMap(lifters =>
          lifters
            .map(l => l.attemptInfo)
            .sortBy([a => DISCIPLINE[a.liftName], "attemptNumberOneIndexed"])
            .map(a => `${a.liftName}${a.attemptNumberOneIndexed}`)
            .uniq()
        )
      )
      .subscribe(infos => (this.attemptGroups = infos));
  }
  getIndexOfAttempt(attemptInfo: IAttemptInfo) {
    const searchString = `${attemptInfo.liftName}${attemptInfo.attemptNumberOneIndexed}`;
    return this.attemptGroups.indexOf(searchString);
  }
  ngOnInit(): void {}
}
