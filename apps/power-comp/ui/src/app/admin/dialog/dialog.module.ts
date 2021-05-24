import { NgModule } from "@angular/core";
import { SharedDialogModule } from "@pc/angular/shared";
import { CompetitionDialogComponent } from "./competition-dialog/competition-dialog.component";
import { CoreModule } from "../../core";
import { MaterialModule } from "@pc/angular/material";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { PlatformDialogComponent } from "./platform-dialog/platform-dialog.component";
import { GroupDialogComponent } from "./group-dialog/group-dialog.component";
import { NgxMatDatetimePickerModule } from "@angular-material-components/datetime-picker";
import { NgxMatMomentModule } from "@angular-material-components/moment-adapter";
import { UtilModule } from "@pc/angular/util";
import { LifterDialogComponent } from "./lifter-dialog/lifter-dialog.component";
import { WeightCategoryDialogComponent } from "./weight-category-dialog/weight-category-dialog.component";

@NgModule({
  imports: [
    SharedDialogModule,
    CoreModule,
    UtilModule,
    FormsModule,
    TranslateModule,
    MaterialModule,
    NgxMatDatetimePickerModule,
    ReactiveFormsModule,
  ],
  declarations: [
    CompetitionDialogComponent,
    PlatformDialogComponent,
    GroupDialogComponent,
    LifterDialogComponent,
    WeightCategoryDialogComponent,
  ],
  exports: [CompetitionDialogComponent, PlatformDialogComponent],
})
export class DialogModule {}
