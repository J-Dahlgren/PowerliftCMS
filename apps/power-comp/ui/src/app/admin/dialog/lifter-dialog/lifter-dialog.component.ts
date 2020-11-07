import { Component, OnInit, Inject } from "@angular/core";
import { EditDialog } from "@dt/angular/shared";
import {
  ILifter,
  IGroup,
  Gender,
  defaultLifts,
  LiftFieldTuple,
  LiftField,
  matchesAnyLiftConfig,
  IWeightClass,
  getWeightClass,
  SquatRackSettingsEnum,
  CompetitionModesEnum
} from "@dt/power-comp/shared";
import { PcDialogOptions } from "../dialog-options";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {
  LifterService,
  GroupService,
  WeightCategoryService
} from "../../../core";
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
  FormArray
} from "@angular/forms";
import { LogService } from "@dt/angular/logger";
import { Observable, BehaviorSubject } from "rxjs";
import { IEntity, ExtractEnumKeys, EnumKeys, StringKey } from "@dt/util";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { createLiftsForm } from "../lifter-dialog-builder";

@Component({
  selector: "pc-lifter-dialog",
  templateUrl: "./lifter-dialog.component.html",
  styleUrls: ["./lifter-dialog.component.scss"]
})
export class LifterDialogComponent extends EditDialog<
  ILifter,
  PcDialogOptions
> {
  competitionMode = new FormControl(
    CompetitionModesEnum[CompetitionModesEnum.SBD]
  );
  rackSettings = ExtractEnumKeys(SquatRackSettingsEnum);
  competitionModes = ExtractEnumKeys(CompetitionModesEnum);

  groups$: Observable<IEntity<IGroup>[]>;
  wCategories: IEntity<IWeightClass>[] = [];
  currentCategory$ = new BehaviorSubject<IWeightClass | null>(null);
  currentYear = new Date().getFullYear();
  constructor(
    @Inject(MAT_DIALOG_DATA) config: PcDialogOptions,
    public dialogRef: MatDialogRef<LifterDialogComponent>,
    groupService: GroupService,
    wCategoryService: WeightCategoryService,
    private lifterService: LifterService,
    private fb: FormBuilder,
    logFactory: LogService
  ) {
    super(
      lifterService,
      logFactory.create(`LifterDialogComponent_${config.id || "add"}`),
      config
    );
    config.title = config.title || "lifter";

    const compQuery = RequestQueryBuilder.create()
      .setFilter({
        field: "competitionId",
        operator: "eq",
        value: +config.competitionId
      })
      .query();

    this.groups$ = groupService.getMany(compQuery);
    wCategoryService
      .getMany(compQuery)
      .subscribe(wc => (this.wCategories = wc));
  }

  modeSelectionChanged(key: EnumKeys<typeof CompetitionModesEnum>) {
    this.form.setControl("lifts", createLiftsForm(defaultLifts[key]));
  }

  getLiftFormArray(field: LiftField) {
    return this.form.get(`lifts.${field}`) as FormArray;
  }
  get liftFields() {
    return LiftFieldTuple;
  }
  getData$(id: number): Observable<IEntity<ILifter>> {
    return this.lifterService.get(id);
  }
  buildForm(data?: IEntity<ILifter>) {
    const fb = this.fb;
    const form = fb.group({
      competitionId: [this.config.competitionId || 0],
      firstname: ["", [Validators.required, Validators.minLength(1)]],
      lastname: ["", [Validators.required, Validators.minLength(1)]],
      groupId: [null],
      gender: ["m"],
      license: [null],
      team: [""],
      equipped: [false],
      bodyWeight: [null, [Validators.min(1)]],
      lot: [0],
      bornYear: [
        null,
        [Validators.min(1900), Validators.max(this.currentYear)]
      ],
      settings: fb.group({
        squat: fb.group({
          rackHeight: [null, Validators.min(0)],
          rackTilt: [SquatRackSettingsEnum[SquatRackSettingsEnum.NONE]]
        }),
        bench: fb.group({
          rackHeight: [null, Validators.min(0)],
          safetyRackHeight: [null, Validators.min(0)],
          liftOffAssistance: [true]
        })
      })
    });
    form
      .get("bodyWeight")
      ?.valueChanges.subscribe(() => this.setWeightCategory(form));
    form
      .get("gender")
      ?.valueChanges.subscribe(() => this.setWeightCategory(form));
    if (data) {
      const match = matchesAnyLiftConfig(data.lifts);
      form.addControl(
        "lifts",
        createLiftsForm(match ? data.lifts : defaultLifts.SBD)
      );
      this.competitionMode.setValue(
        match || CompetitionModesEnum[CompetitionModesEnum.SBD]
      );
    } else {
      form.addControl("lifts", createLiftsForm(defaultLifts.SBD));
      this.competitionMode.setValue(
        CompetitionModesEnum[CompetitionModesEnum.SBD]
      );
    }
    return form;
  }
  setWeightCategory(form: FormGroup) {
    this.currentCategory$.next(
      getWeightClass(form.getRawValue() as ILifter, this.wCategories)
    );
  }
}
