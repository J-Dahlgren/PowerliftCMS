import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RefereeMainComponent } from "./main.component";
import { RefereeSelectComponent } from "./referee-select.component";
import { RefereeComponent } from "./referee.component";

const routes: Routes = [
  {
    path: "refereeing",
    component: RefereeMainComponent,
    children: [
      { path: "", component: RefereeSelectComponent },
      { path: ":id", component: RefereeComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefereeRoutingModule {}
