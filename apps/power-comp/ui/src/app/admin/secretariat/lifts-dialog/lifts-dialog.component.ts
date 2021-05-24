import {
  Component,
  Inject,
  AfterViewInit,
  OnDestroy,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { EditDialog, DialogOptions } from "@pc/angular/shared";
import {
  ILifter,
  LiftFieldTuple,
  LiftField,
  matchesAnyLiftConfig,
  defaultLifts,
  LiftStatus,
  IAttempt,
  requestedWeight,
} from "@pc/power-comp/shared";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { IEntity, cutDecimal } from "@pc/util";
import { Observable, interval, merge, timer } from "rxjs";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { createLiftsForm } from "../../dialog";
import { LifterService } from "../../../core";
import { LogService } from "@pc/angular/logger";
import { SubSink } from "subsink";
import { debounceTime, auditTime } from "rxjs/operators";
import { FocusElementDirective } from "@pc/angular/util";

@Component({
  templateUrl: "./lifts-dialog.component.html",
  styleUrls: ["lifts-dialog.component.scss"],
})
export class LiftsDialogComponent
  extends EditDialog<ILifter>
  implements OnDestroy, AfterViewInit {
  subs = new SubSink();
  readonly statuses = LiftStatus;

  @ViewChildren(FocusElementDirective)
  focusDirectives!: QueryList<FocusElementDirective>;

  constructor(
    @Inject(MAT_DIALOG_DATA) config: DialogOptions,
    public dialogRef: MatDialogRef<LiftsDialogComponent>,
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
  }

  get liftFields() {
    return LiftFieldTuple;
  }
  getLiftFormArray(field: LiftField) {
    return this.form.get(`lifts.${field}`) as FormArray;
  }
  getData$(id: number): Observable<IEntity<ILifter>> {
    return this.lifterService.get(id);
  }
  buildForm(data?: IEntity<ILifter> | undefined): FormGroup {
    const form = new FormGroup({});
    if (data) {
      const match = matchesAnyLiftConfig(data.lifts);
      form.addControl(
        "lifts",
        createLiftsForm(match ? data.lifts : defaultLifts.SBD)
      );
      merge(timer(200), timer(500)).subscribe(() => this.focusInput());
    } else {
      form.addControl("lifts", createLiftsForm(defaultLifts.SBD));
    }
    return form;
  }
  afterBuild() {
    this.createStatusListeners();
  }
  createStatusListeners() {
    const formArrays = this.liftFields
      .map((f) => this.getLiftFormArray(f))
      .filter((f) => !!f);
    for (const formArray of formArrays) {
      for (let i = 0; i < formArray.length - 1; i++) {
        // Don't add listener for last
        const source = formArray.at(i) as FormGroup;
        const target = formArray.at(i + 1) as FormGroup;
        source.valueChanges
          .pipe(debounceTime(100))
          .subscribe(() => this.statusChanges(source, target));
        this.statusChanges(source, target);
      }
    }
  }
  statusChanges(sourceGroup: FormGroup, targetGroup: FormGroup) {
    const sAttempt = sourceGroup.getRawValue() as IAttempt;
    const tAttempt = targetGroup.getRawValue() as IAttempt;
    const sourceWeight = requestedWeight(sAttempt) || 0;
    const currentAutomaticForNext = tAttempt.automatic;
    let nextAutomaticValue: number | null = null;

    if (sAttempt.status === LiftStatus.SUCCESSFUL && sourceWeight) {
      nextAutomaticValue = cutDecimal(sourceWeight + 2.5, 2);
    } else if (sAttempt.status <= LiftStatus.FAILED) {
      nextAutomaticValue = cutDecimal(sourceWeight, 2);
    }
    if (nextAutomaticValue !== currentAutomaticForNext) {
      targetGroup.get("automatic")?.patchValue(nextAutomaticValue);
    }
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  ngAfterViewInit() {}
  focusInput() {
    let focusIndex = 0;
    for (const liftName of this.liftFields) {
      const formArray = this.getLiftFormArray(liftName);
      for (let i = 0; i < formArray.length; i++) {
        const group = formArray.at(i) as FormGroup;
        if (group.get("status")?.value === LiftStatus.NOT_ATTEMPTED) {
          this.focusDirectives.toArray()[focusIndex].focus();
          return;
        }
        focusIndex++;
      }
    }
  }
}
