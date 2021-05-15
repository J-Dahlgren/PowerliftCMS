import { NgModule } from "@angular/core";
import { MaterialModule } from "@dt/angular/material";
import { RouterModule, Route } from "@angular/router";
import { CompetitionListComponent } from "./competition-list/competition-list.component";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { UtilModule } from "@dt/angular/util";
import { CompetitionEditComponent } from "./competition-edit/competition-edit.component";
import { BrowserModule } from "@angular/platform-browser";
import { GroupListComponent } from "./group-list/group-list.component";
import { PlatformListComponent } from "./platform-list/platform-list.component";
import { TableModule } from "@dt/angular/shared";
import { LifterListComponent } from "./lifter-list/lifter-list.component";
import { FormsModule } from "@angular/forms";
import { DialogModule } from "./dialog";
import { SecretariatModule } from "./secretariat";
import { WeightCategoryListComponent } from "./weight-category-list/weight-category-list.component";
import { ResultListComponent } from "./result-list/result-list.component";
import { AuthGuard } from "../auth.guard";
const baseRoute = "competition";
export const adminRoutes: Route[] = [
  {
    path: baseRoute,
    canActivate: [AuthGuard],
    component: CompetitionListComponent
  },
  {
    component: CompetitionEditComponent,
    path: `${baseRoute}/:id`,
    canActivate: [AuthGuard],
    children: [
      { path: "lifters", component: LifterListComponent },
      { path: "groups", component: GroupListComponent },
      { path: "platforms", component: PlatformListComponent },
      { path: "weight-categories", component: WeightCategoryListComponent },
      { path: "results", component: ResultListComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    SecretariatModule,
    UtilModule,
    DialogModule,
    FormsModule,
    TableModule,
    MaterialModule,
    TranslateModule,
    RouterModule.forChild(adminRoutes)
  ],
  declarations: [
    CompetitionListComponent,
    CompetitionEditComponent,
    GroupListComponent,
    PlatformListComponent,
    LifterListComponent,
    WeightCategoryListComponent,
    ResultListComponent
  ]
})
export class AdminModule {}
