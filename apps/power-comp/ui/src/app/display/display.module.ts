import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { UtilModule } from "@pc/angular/util";
import { PlatformTimerComponent } from "./platform-timer/platform-timer.component";
import { CommonModule } from "@angular/common";
import { DecisionDisplayComponent } from "./decision-display/decision-display.component";
import { AttemptInfoBarComponent } from "./attempt-info-bar/attempt-info-bar.component";
import { LiftOrderComponent } from "./lift-order/lift-order.component";
import { Routes, Route, RouterModule } from "@angular/router";
import { MaterialModule } from "@pc/angular/material";
import { CdkTableModule } from "@angular/cdk/table";
import { DisplayShellComponent } from "./display-shell.component";
import { ResultBoardComponent } from "./result-board/result-board.component";
import { AttemptBoardComponent } from "./attempt-board/attempt-board.component";
import { PlateLoadComponent } from "./plate-load/plate-load.component";
import { LifterInfoComponent } from "./lifter-info/lifter-info.component";
import { DecisionInputComponent } from "./decision-display/decision-input.component";

const routes: Route[] = [
  {
    component: DisplayShellComponent,
    path: "display",
    children: [
      {
        path: "lift-order",
        component: LiftOrderComponent,
      },
      {
        path: "result-board",
        component: ResultBoardComponent,
      },
      {
        path: "attempt-board",
        component: AttemptBoardComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MaterialModule,
    CdkTableModule,
    UtilModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    PlatformTimerComponent,
    DecisionDisplayComponent,
    DecisionInputComponent,
    AttemptInfoBarComponent,
    LiftOrderComponent,
    DisplayShellComponent,
    ResultBoardComponent,
    AttemptBoardComponent,
    PlateLoadComponent,
    LifterInfoComponent,
  ],
  exports: [PlatformTimerComponent, DecisionDisplayComponent],
})
export class DisplayModule {}
