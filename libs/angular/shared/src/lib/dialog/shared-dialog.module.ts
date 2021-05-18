import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "@pc/angular/material";
import { ReactiveFormsModule } from "@angular/forms";
import { GenericEditDialogComponent } from "./generic-edit-dialog/generic-edit-dialog.component";
import { TranslateModule } from "@ngx-translate/core";
import { TRANSLATE } from "./token";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
@NgModule({
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, TranslateModule],
  providers: [],
  declarations: [GenericEditDialogComponent, ConfirmDialogComponent],
  exports: [GenericEditDialogComponent]
})
export class SharedDialogModule {
  static forRoot(translated?: boolean): ModuleWithProviders {
    return {
      ngModule: SharedDialogModule,
      providers: [{ provide: TRANSLATE, useValue: translated || false }]
    };
  }
}
