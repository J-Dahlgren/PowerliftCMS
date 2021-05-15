import { NgModule } from "@angular/core";
import { MaterialModule } from "@dt/angular/material";
import { HttpClientModule } from "@angular/common/http";
import { SecretariatMainComponent } from "./secretariat-main/secretariat-main.component";
import { RouterModule, Route } from "@angular/router";
import { SecretariatListComponent } from "./secretariat-list/secretariat-list.component";
import { CommonModule } from "@angular/common";
import { SecretariatControlComponent } from "./secretariat-control/secretariat-control.component";
import { TranslateModule } from "@ngx-translate/core";
import { TableModule, SharedDialogModule } from "@dt/angular/shared";
import { LiftsDialogComponent } from "./lifts-dialog/lifts-dialog.component";
import { ReactiveFormsModule } from "@angular/forms";
import { UtilModule } from "@dt/angular/util";
import { DisplayModule } from "../../display";
import { FlexLayoutModule } from "@angular/flex-layout";
import { TimekeeperComponent } from "./timekeeper/timekeeper.component";
import { AuthGuard } from "../../auth.guard";
const baseRoute = "secretariat";
const routes: Route[] = [
  {
    path: baseRoute,
    canActivate: [AuthGuard],
    component: SecretariatMainComponent
  },
  {
    path: "timekeeper",
    canActivate: [AuthGuard],
    component: TimekeeperComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    TableModule,
    FlexLayoutModule,
    UtilModule,
    DisplayModule,
    SharedDialogModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    SecretariatMainComponent,
    SecretariatListComponent,
    SecretariatControlComponent,
    LiftsDialogComponent,
    TimekeeperComponent
  ],
  exports: []
})
export class SecretariatModule {}
