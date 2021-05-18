import { Observable } from "rxjs";
import { FormControl, Validators, FormGroup, FormArray } from "@angular/forms";
import { tap } from "rxjs/operators";
import { Component, Inject } from "@angular/core";
import { EditDialog, DialogOptions } from "@pc/angular/shared";
import {
  IPlatform,
  defaultPlatformWeights,
  IPlatformWeights,
  IWeightPlate
} from "@pc/power-comp/shared";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PlatformService } from "../../../core";
import { LogService } from "@pc/angular/logger";
import { IEntity } from "@pc/util";
import { PcDialogOptions } from "../dialog-options";

@Component({
  selector: "pc-platform-dialog",
  templateUrl: "./platform-dialog.component.html",
  styleUrls: ["./platform-dialog.component.scss"]
})
export class PlatformDialogComponent extends EditDialog<
  IPlatform,
  PcDialogOptions
> {
  constructor(
    @Inject(MAT_DIALOG_DATA) config: PcDialogOptions,
    public dialogRef: MatDialogRef<PlatformDialogComponent>,
    private platformService: PlatformService,
    logFactory: LogService
  ) {
    super(
      platformService,
      logFactory.create("PlatformDialogComponent"),
      config
    );
    config.title = config.title || "platform";
  }
  getData$(id: number): Observable<IEntity<IPlatform>> {
    return this.platformService.get(id);
  }
  buildForm(data?: IEntity<IPlatform>) {
    const form = new FormGroup({});
    form.addControl(
      "competitionId",
      new FormControl(this.config.competitionId || 0)
    );
    form.addControl(
      "name",
      new FormControl("", [Validators.required, Validators.minLength(1)])
    );
    form.addControl("weights", this.createWeights(defaultPlatformWeights));
    return form;
  }
  get plates() {
    return this.form.get("weights")?.get("plates") as FormArray;
  }
  createWeights(weights: IPlatformWeights) {
    return new FormGroup({
      collarWeight: new FormControl(weights.collarWeight, [
        Validators.required,
        Validators.min(1)
      ]),
      barWeight: new FormControl(weights.barWeight, [
        Validators.required,
        Validators.min(1)
      ]),
      plates: new FormArray(this.createPlates(weights.plates))
    });
  }
  createPlates(plates: IWeightPlate[]) {
    return plates.map(
      plate =>
        new FormGroup({
          weight: new FormControl(plate.weight, [
            Validators.required,
            Validators.min(0)
          ]),
          quantity: new FormControl(plate.quantity, [Validators.max(20)])
        })
    );
  }
}
