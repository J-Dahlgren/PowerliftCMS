import { Component, OnInit, Inject, Optional } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ModalData } from "../modal-data";
import { TRANSLATE } from "../token";
@Component({
  selector: "dt-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.scss"]
})
export class ConfirmDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
    @Inject(TRANSLATE) @Optional() public translate?: boolean
  ) {}

  ngOnInit(): void {}
}
