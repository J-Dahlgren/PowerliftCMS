import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RefereeRoutingModule } from "./referee-routing.module";
import { RefereeMainComponent } from "./main.component";
import { RefereeSelectComponent } from "./referee-select.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from "@pc/angular/material";
import { RefereeComponent } from "./referee.component";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    RefereeMainComponent,
    RefereeSelectComponent,
    RefereeComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    RefereeRoutingModule,
    TranslateModule,
    MaterialModule,
  ],
})
export class RefereeModule {}
