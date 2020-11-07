import { ILifts, IAttempt } from "@dt/power-comp/shared";
import { FormGroup, FormControl, FormArray, Validators } from "@angular/forms";
import { extractKeys } from "@dt/util";

export function createLiftsForm(lifts: ILifts) {
  const liftsForm = new FormGroup({});
  for (const key of extractKeys(lifts)) {
    liftsForm.addControl(key, createAttempsListForm(lifts[key]));
  }
  return liftsForm;
}
export function createAttempsListForm(attempts: IAttempt[]) {
  return new FormArray(attempts.map(a => createAttemptForm(a)));
}
export function createAttemptForm(attempt: IAttempt) {
  const automatic = new FormControl(attempt.automatic);
  automatic.disable();
  return new FormGroup({
    status: new FormControl(attempt.status),
    requested: new FormControl(attempt.requested, [
      Validators.min(1),
      Validators.max(700)
    ]),
    automatic
  });
}
