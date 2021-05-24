import { Component, OnInit, Inject } from "@angular/core";
import { IGroup, IPlatform } from "@pc/power-comp/shared";
import { EditDialog, DialogOptions } from "@pc/angular/shared";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { LogService } from "@pc/angular/logger";
import { GroupService, PlatformService } from "../../../core";
import { IEntity } from "@pc/util";
import { Observable } from "rxjs";
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import { RequestQueryBuilder } from "@nestjsx/crud-request";

import { PcDialogOptions } from "../dialog-options";

@Component({
  selector: "pc-group-dialog",
  templateUrl: "./group-dialog.component.html",
  styleUrls: ["./group-dialog.component.scss"],
})
export class GroupDialogComponent extends EditDialog<IGroup, PcDialogOptions> {
  platforms$: Observable<IEntity<IPlatform>[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) config: PcDialogOptions,
    public dialogRef: MatDialogRef<GroupDialogComponent>,
    private groupService: GroupService,
    platformService: PlatformService,
    private fb: FormBuilder,
    logFactory: LogService
  ) {
    super(
      groupService,
      logFactory.create(`GroupDialogComponent_${config.id || "add"}`),
      config
    );

    config.title = config.title || "group";
    this.platforms$ = platformService.getMany(
      RequestQueryBuilder.create()
        .setFilter({
          field: "competitionId",
          operator: "eq",
          value: config.competitionId,
        })
        .query()
    );
  }

  getData$(id: number): Observable<IEntity<IGroup>> {
    return this.groupService.get(id);
  }
  buildForm() {
    const form = new FormGroup({});
    form.addControl(
      "name",
      new FormControl("", [Validators.required, Validators.minLength(1)])
    );
    form.addControl(
      "competitionId",
      new FormControl(this.config.competitionId || 0)
    );
    form.addControl("platformId", new FormControl(null));
    form.addControl("weighInTime", new FormControl());
    form.addControl("competitionTime", new FormControl());
    return form;
  }
}
