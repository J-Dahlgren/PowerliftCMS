import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder,
  FormArray
} from "@angular/forms";
import { IEntity, ExtractEnumKeys } from "@pc/util";
import { Component, Inject } from "@angular/core";
import { EditDialog, DialogMode } from "@pc/angular/shared";
import {
  ICompetition,
  defaultWeightClasses,
  Gender,
  AgeCategoryName
} from "@pc/power-comp/shared";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DialogOptions } from "@pc/angular/shared";
import { Observable, merge, of } from "rxjs";
import { LogService } from "@pc/angular/logger";
import { CompetitionService } from "../../../core";
import { TranslateService } from "@ngx-translate/core";
import { switchMap, startWith, map, tap, debounceTime } from "rxjs/operators";
import { values } from "lodash";

@Component({
  selector: "pc-competition-dialog",
  templateUrl: "./competition-dialog.component.html",
  styleUrls: ["./competition-dialog.component.scss"]
})
export class CompetitionDialogComponent extends EditDialog<
  ICompetition,
  DialogOptions
> {
  genders = ExtractEnumKeys(Gender).map(g => Gender[g]);

  constructor(
    @Inject(MAT_DIALOG_DATA) config: DialogOptions,
    public dialogRef: MatDialogRef<CompetitionDialogComponent>,
    private competitionService: CompetitionService,
    private translate: TranslateService,
    logFactory: LogService,
    private fb: FormBuilder
  ) {
    super(
      competitionService,
      logFactory.create("CompetitionDialogComponent"),
      config
    );
    config.title = config.title || "competition";
  }
  getData$(id: number): Observable<IEntity<ICompetition>> {
    return this.competitionService.get(id);
  }
  buildForm() {
    const form = new FormGroup({});
    form.addControl(
      "name",
      new FormControl("", [Validators.required, Validators.minLength(1)])
    );
    form.addControl("city", new FormControl(""));
    form.addControl("location", new FormControl(""));
    form.addControl("active", new FormControl(true));
    const weightCategories = new FormArray([]);

    if (this.dialogMode === DialogMode[DialogMode.ADD]) {
      for (const wClass of defaultWeightClasses) {
        const restrictions = new FormArray(
          wClass.ageRestriction
            ? wClass.ageRestriction.map(r => this.fb.control(r))
            : []
        );
        const group = this.fb.group({
          active: [wClass.active],
          minExclusive: [wClass.minExclusive],
          maxInclusive: [wClass.maxInclusive],
          gender: [wClass.gender],
          name: [wClass.name]
        });
        group.addControl("ageRestriction", restrictions);
        weightCategories.push(group);
      }
      form.addControl("weightCategories", weightCategories);
    }

    return form;
  }
  get weightClasses() {
    return this.form.get("weightCategories") as FormArray;
  }
  getAgeRestrictionsTooltip(classGroup: FormGroup) {
    const restrictions: AgeCategoryName[] =
      classGroup.get("ageRestriction")?.value || [];
    return restrictions.join(",");
    // this.translate.getTranslation()
  }
  getRestrectionsX(group: FormGroup) {
    const restrictionsNames =
      ((group.get("ageRestriction") as FormArray).value as AgeCategoryName[]) ||
      [];
    const translateKeys = restrictionsNames.map(r => "age-category." + r);

    if (!translateKeys.length) {
      return of("");
    }
    return this.translate
      .get(translateKeys)
      .pipe(map(v => values(v).join("\n")));
    // return merge(
    //   this.translate.get(translateKeys),
    //   this.translate.onLangChange.pipe(
    //     switchMap(() => this.translate.get(translateKeys))
    //   )
    // ).pipe(map(v => values(v).join("\n")));
  }
  getRestrections(group: FormGroup) {
    return group.get("ageRestriction") as FormArray;
  }
}
