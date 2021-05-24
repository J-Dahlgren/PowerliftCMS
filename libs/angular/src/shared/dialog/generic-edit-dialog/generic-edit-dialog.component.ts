import { Component, Input, OnInit, Inject } from "@angular/core";
import { Observable, Subject, BehaviorSubject, of } from "rxjs";
import { FormGroup } from "@angular/forms";
import { EditDialog } from "./edit-dialog";
import { tap, switchMap, map, exhaustMap, catchError } from "rxjs/operators";
import { SnackBarService } from "../../../material";
import { TRANSLATE } from "../token";
@Component({
  selector: "dt-generic-edit-dialog",
  styleUrls: ["./generic-edit-dialog.component.scss"],
  templateUrl: "./generic-edit-dialog.component.html",
})
export class GenericEditDialogComponent<T extends object> implements OnInit {
  @Input() parent!: EditDialog<T>;
  loading$!: Observable<boolean>;
  submitClick$ = new Subject<void>();
  @Input() form!: FormGroup;
  saving$ = new BehaviorSubject(false);

  constructor(
    private snackBar: SnackBarService,
    @Inject(TRANSLATE) public translate: boolean
  ) {}
  ngOnInit() {
    this.loading$ = this.parent.select("loading");
    this.parent.error$.subscribe((e) =>
      this.snackBar.open(e?.message, "warn", 2500)
    );
    this.submitClick$
      .pipe(
        tap(() => this.saving$.next(true)),
        exhaustMap(() =>
          this.parent.save().pipe(
            tap(
              (entity) => {
                this.snackBar.open("Saved", "accent", 2500);
                this.parent.dialogRef.close(entity);
              },
              (e) => {
                this.snackBar.open(e?.message, "warn", 2500);
                this.saving$.next(false);
              },
              () => this.saving$.next(false)
            ),
            catchError(() => of(0))
          )
        ),
        catchError(() => of(0))
      )
      .subscribe();
  }
}
