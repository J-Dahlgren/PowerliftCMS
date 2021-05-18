import { Observable, Subject } from "rxjs";
import { OnInit, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { DialogOptions } from "./dialog-options";
import { MatDialogRef } from "@angular/material/dialog";
import { UiLogger } from "../../../logger";
import { ProtectedStore, IEntity } from "@pc/util";
import { IApiService } from "../../../crud-api";
import { SubSink } from "subsink";
export interface DialogState {
  loading: boolean;
  saving: boolean;
}
export enum DialogMode {
  ADD,
  EDIT
}
export abstract class EditDialog<
  T extends object,
  DO extends DialogOptions = DialogOptions
> extends ProtectedStore<DialogState> implements OnInit, OnDestroy {
  protected subs = new SubSink();
  form: FormGroup = new FormGroup({});
  error$ = new Subject<any>();
  private _dialogMode = DialogMode[DialogMode.ADD];
  get dialogMode() {
    return this._dialogMode;
  }
  abstract dialogRef: MatDialogRef<EditDialog<T, DO>, IEntity<T>>;
  constructor(
    public readonly api: IApiService<T>,
    protected logger: UiLogger,
    public config: DO
  ) {
    super({ loading: false, saving: false });
  }
  abstract getData$(id: number): Observable<IEntity<T>>;
  save() {
    if (this.config.id) {
      return this.api.patch(this.config.id, this.form.getRawValue());
    }

    return this.api.create(this.form.getRawValue());
  }
  afterBuild() {}
  ngOnInit() {
    this.form = this.buildForm();
    if (this.config.id) {
      this._dialogMode = DialogMode[DialogMode.EDIT];
      this.set("loading", true);
      this.getData$(this.config.id).subscribe(
        data => {
          this.form = this.buildForm(data);
          this.form.patchValue(data);
          this.afterBuild();
        },
        e => {
          this.set("loading", false);
          this.error$.next(e);
          this.dialogRef.close();
        },
        () => this.set("loading", false)
      );
    } else {
      this.afterBuild();
    }
  }
  public get model() {
    return this;
  }
  abstract buildForm(data?: IEntity<T>): FormGroup;
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
