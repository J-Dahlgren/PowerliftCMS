import { Injectable, Type } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DialogOptions } from "./generic-edit-dialog";
import { EditDialog } from "./generic-edit-dialog/edit-dialog";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { ModalData } from "./modal-data";
import { IEntity } from "@dt/util";

@Injectable({ providedIn: "root" })
export class ModalService {
  constructor(private dialog: MatDialog) {}
  openConfirmModal(data: ModalData) {
    return this.dialog
      .open<ConfirmDialogComponent, ModalData, boolean>(
        ConfirmDialogComponent,
        { data }
      )
      .afterClosed();
  }
  openEditModal<
    T extends object,
    DO extends DialogOptions = DialogOptions,
    D extends EditDialog<T> = EditDialog<T>
  >(component: Type<D>, opts: MatDialogConfig<DO> = {}) {
    return this.dialog.open<D, DialogOptions, IEntity<T>>(component, opts);
  }
}
