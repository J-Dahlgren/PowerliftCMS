import { Observable } from "rxjs";
import {
  FormControl,
  Validators,
  FormGroup,
  FormArray,
  FormBuilder,
} from "@angular/forms";
import { tap } from "rxjs/operators";
import { Component, Inject } from "@angular/core";
import { EditDialog } from "@pc/angular/shared";
import { IWeightClass, Gender } from "@pc/power-comp/shared";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { WeightCategoryService } from "../../../core";
import { LogService } from "@pc/angular/logger";
import { IEntity } from "@pc/util";
import { PcDialogOptions } from "../dialog-options";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "pc-weight-category-dialog",
  templateUrl: "./weight-category-dialog.component.html",
  styleUrls: ["./weight-category-dialog.component.scss"],
})
export class WeightCategoryDialogComponent extends EditDialog<
  IWeightClass,
  PcDialogOptions
> {
  constructor(
    @Inject(MAT_DIALOG_DATA) config: PcDialogOptions,
    public dialogRef: MatDialogRef<WeightCategoryDialogComponent>,
    private platformService: WeightCategoryService,
    private fb: FormBuilder,
    private translate: TranslateService,
    logFactory: LogService
  ) {
    super(
      platformService,
      logFactory.create("WeightCategoryDialogComponent"),
      config
    );
    config.title = config.title || "weight-category";
  }
  getData$(id: number): Observable<IEntity<IWeightClass>> {
    return this.platformService.get(id).pipe(tap((data) => {}));
  }
  buildForm(data?: IEntity<IWeightClass>) {
    if (data) {
      const gender: string = this.translate.instant(
        "weight-category." + data.gender
      );
      this.config = { ...this.config, title: `${gender}${data.name}` };
    }

    const form = this.fb.group({
      competitionId: [this.config.competitionId || 0],
      gender: [Gender.MALE],
      minExclusive: [null, [Validators.required, Validators.min(0)]],
      maxInclusive: [null, Validators.min(0)],
      active: [true],
    });
    return form;
  }
}
