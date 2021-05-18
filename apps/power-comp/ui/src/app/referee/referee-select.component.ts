import { Component, Inject, OnInit } from "@angular/core";
import { JudgeDecision, IServerPlatformEvents } from "@pc/power-comp/shared";
import { InRoom } from "@pc/util";
import { BehaviorSubject, Observable } from "rxjs";
import { SERVER_EVENTS_TOKEN } from "../core";

@Component({
  selector: "pc-referee-select",
  template: `
    <h2>{{ "referee.orientation" | translate }}</h2>
    <div fxLayoutGap="10px">
      <a
        *ngFor="let ref of referees$ | async; let i = index"
        mat-raised-button
        [routerLink]="[i + 1]"
        >{{ "referee" | translate }} {{ i + 1 }}</a
      >
    </div>
  `
})
export class RefereeSelectComponent implements OnInit {
  referees$: Observable<number[]>;
  constructor(
    @Inject(SERVER_EVENTS_TOKEN)
    serverEvents: InRoom<IServerPlatformEvents>
  ) {
    this.referees$ = new BehaviorSubject([1, 2, 3]);
  }
  ngOnInit(): void {}
}
