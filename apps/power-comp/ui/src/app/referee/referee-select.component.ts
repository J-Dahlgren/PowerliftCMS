import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { IPlatformEvents } from "../core";

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
  `,
})
export class RefereeSelectComponent implements OnInit {
  referees$: Observable<number[]>;
  constructor(serverEvents: IPlatformEvents) {
    this.referees$ = new BehaviorSubject([1, 2, 3]);
  }
  ngOnInit(): void {}
}
