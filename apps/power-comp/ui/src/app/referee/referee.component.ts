import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { JudgeDecision } from "@pc/power-comp/shared";
import { Observable } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { ClientEventService } from "../admin/secretariat/client-event.service";
import { IPlatformEvents } from "../core";

@Component({
  selector: "pc-referee",
  template: `
    <style>
      .x2 {
        transform: scale(2);
      }
      .buttons {
        padding: 10px;
        height: 100%;
        & > button {
          max-height: 250px;
        }
      }
    </style>
    <div
      fxLayoutGap="30px"
      fxLayout="column"
      fxLayout.gt-xs="row"
      class="buttons"
    >
      <button
        fxFlex
        mat-raised-button
        class="decision_success"
        (click)="goodLift()"
        [disabled]="(currentDecision$ | async) === 1"
      >
        <mat-icon svgIcon="check" class="x2"></mat-icon>
      </button>
      <button
        fxFlex
        mat-raised-button
        (click)="reset()"
        [disabled]="!(currentDecision$ | async)"
        style="font-size: 1em;"
      >
        {{ "decision.reset" | translate }}
      </button>
      <button
        fxFlex
        mat-raised-button
        color="warn"
        (click)="noLiftRed()"
        [disabled]="(currentDecision$ | async) === 2"
      >
        <mat-icon svgIcon="close" class="x2"></mat-icon>
      </button>
      <button
        fxFlex
        mat-raised-button
        class="failed_blue"
        (click)="noLiftBlue()"
        [disabled]="(currentDecision$ | async) === 3"
      >
        <mat-icon svgIcon="close" class="x2"></mat-icon>
      </button>
      <button
        fxFlex
        mat-raised-button
        class="failed_yellow"
        (click)="noLiftYellow()"
        [disabled]="(currentDecision$ | async) === 4"
      >
        <mat-icon svgIcon="close" class="x2"></mat-icon>
      </button>
    </div>
  `,
})
export class RefereeComponent implements OnInit {
  judgeNumber: number;
  currentDecision$: Observable<JudgeDecision>;
  constructor(
    private route: ActivatedRoute,
    private platformEvent: IPlatformEvents,
    private clientEvents: ClientEventService
  ) {
    this.judgeNumber = +route.snapshot.params.id;
    this.currentDecision$ = platformEvent
      .on("decisions")
      .pipe(
        map(
          (decisions) =>
            decisions[this.judgeNumber - 1] || JudgeDecision.NOT_DECIDED
        )
      );
  }
  private sendDecision(decision: JudgeDecision) {
    this.clientEvents
      .emitEvent("decision", {
        d: JudgeDecision[decision] as keyof typeof JudgeDecision,
        judgeNumber: this.judgeNumber,
      })
      .subscribe();
  }
  goodLift() {
    this.sendDecision(JudgeDecision.SUCCESS);
  }
  noLiftRed() {
    this.sendDecision(JudgeDecision.FAILED_RED);
  }
  noLiftBlue() {
    this.sendDecision(JudgeDecision.FAILED_BLUE);
  }
  noLiftYellow() {
    this.sendDecision(JudgeDecision.FAILED_YELLOW);
  }
  reset() {
    this.sendDecision(JudgeDecision.NOT_DECIDED);
  }
  ngOnInit() {}
}
