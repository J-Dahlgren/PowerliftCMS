import { IEntity, IStateStore, Constructor, StateStore } from "@pc/util";
import { EntityListComponent } from "./entity-list.component";
import { IApiService } from "@pc/angular/crud-api";
import { EditDialog, ModalService } from "@pc/angular/shared";
import { PcDialogOptions } from "./dialog";
import { CompetitionEditService } from "./competition-edit.service";
import { OnInit, ViewChild } from "@angular/core";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { SnackBarService } from "@pc/angular/material";
import { TranslateService } from "@ngx-translate/core";
import { takeUntil } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
export abstract class PowerCompListComponent<
  T extends {},
  FilterT extends {} = {}
> extends EntityListComponent<T, FilterT> implements OnInit {
  abstract filters: StateStore<FilterT>;
  protected abstract entityService: IApiService<T>;
  protected abstract editService: CompetitionEditService;
  protected abstract modalService: ModalService;
  protected abstract snack: SnackBarService;
  protected abstract translate: TranslateService;
  dataSource: MatTableDataSource<IEntity<T>> = new MatTableDataSource(
    [] as IEntity<T>[]
  );

  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor() {
    super();
  }

  abstract getDialogComponentType(): Constructor<
    EditDialog<T, PcDialogOptions>
  >;
  ngOnInit() {
    super.ngOnInit();
    this.subs.sink = this.editService.onEdit$.subscribe(() => this.refresh());

    this.subs.sink = this.elements$.subscribe(data => {
      this.dataSource.data = data;
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    });
  }
  create(): void {
    this.modalService
      .openEditModal<T, PcDialogOptions>(this.getDialogComponentType(), {
        data: {
          competitionId: +this.editService.get("id")
        }
      })
      .afterClosed()
      .subscribe(() => this.editService.emitEdited());
  }
  get competitionId() {
    return this.editService.get("id");
  }
  abstract getEntityTitle(entity: IEntity<T>): string;
  protected abstract queryBuilder(
    queryBuilder: RequestQueryBuilder
  ): RequestQueryBuilder;

  createQueryString() {
    const queryBuilder = RequestQueryBuilder.create({
      filter: {
        field: "competitionId",
        operator: "eq",
        value: +this.editService.get("id")
      }
    });
    return this.queryBuilder(queryBuilder).query();
  }
  edit(entity: IEntity<T>): void {
    this.modalService
      .openEditModal<T, PcDialogOptions>(this.getDialogComponentType(), {
        data: {
          id: +entity.id,
          title: this.getEntityTitle(entity),
          competitionId: +this.editService.get("id")
        }
      })
      .afterClosed()
      .subscribe(() => this.editService.emitEdited());
  }
  delete(entity: IEntity<T>): void {
    this.entityService.delete(entity.id).subscribe(
      () => {
        this.editService.emitEdited();
      },
      e =>
        this.translate
          .get("error.delete-fail")
          .subscribe(m => this.snack.open(m, "warn", 2500))
    );
  }
}
