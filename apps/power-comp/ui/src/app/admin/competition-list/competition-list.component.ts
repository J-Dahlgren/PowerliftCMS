import { Component, OnInit, ViewChild } from "@angular/core";
import { Observable } from "rxjs";
import { ModalService, DialogOptions } from "@pc/angular/shared";
import { Router, ActivatedRoute } from "@angular/router";

import {
  filter,
  map,
  exhaustMap,
  switchMap,
  auditTime,
  debounceTime
} from "rxjs/operators";
import { IEntity, IStateStore, StateStore } from "@pc/util";
import { ICompetition, defaultPlatformWeights } from "@pc/power-comp/shared";
import { CompetitionService, AppInfoService } from "../../core";
import { CompetitionDialogComponent } from "../dialog/competition-dialog/competition-dialog.component";
import { PlatformService } from "../../core";
import { EntityListComponent } from "../entity-list.component";
import { IApiService } from "@pc/angular/crud-api";
import { SnackBarService } from "@pc/angular/material";
import { TranslateService } from "@ngx-translate/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
@Component({
  selector: "pc-competition-list",
  templateUrl: "./competition-list.component.html",
  styleUrls: ["./competition-list.component.scss"]
})
export class CompetitionListComponent extends EntityListComponent<ICompetition>
  implements OnInit {
  dataSource: MatTableDataSource<
    IEntity<ICompetition>
  > = new MatTableDataSource([] as IEntity<ICompetition>[]);
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  filters = new StateStore({});
  columns = ["name", "active", "city", "location"];

  constructor(
    private modalService: ModalService,
    protected entityService: CompetitionService,
    protected platformService: PlatformService,
    protected appInfo: AppInfoService,
    protected snack: SnackBarService,
    private router: Router,
    private route: ActivatedRoute,
    protected translate: TranslateService
  ) {
    super();
  }
  ngOnInit() {
    super.ngOnInit();
    this.subs.sink = this.appInfo.connected$
      .pipe(filter(c => c))
      .subscribe(() => this.refresh());
    this.subs.sink = this.elements$.subscribe(data => {
      this.dataSource.data = data;
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    });
  }

  createQueryString(): string {
    return "";
  }
  delete(entity: IEntity<ICompetition>): void {
    this.entityService.delete(entity.id).subscribe(
      () => this.refresh(),
      e =>
        this.translate
          .get("error.delete-fail")
          .subscribe(m => this.snack.open(m, "warn", 2500))
    );
  }
  create(): void {
    this.modalService
      .openEditModal<ICompetition>(CompetitionDialogComponent, {
        data: { title: "" },
        minHeight: "300"
      })
      .afterClosed()
      .pipe(
        filter(r => !!r),
        map(r => r as IEntity<ICompetition>)
      )
      .subscribe(r => {
        this.platformService
          .create({
            competitionId: +r.id,
            weights: defaultPlatformWeights,
            name: "P1"
          })
          .subscribe(e => this.click(+r.id));
      });
  }
  edit(entity: IEntity<ICompetition>): void {
    this.modalService
      .openEditModal<ICompetition, DialogOptions>(CompetitionDialogComponent, {
        data: {
          id: +entity.id,
          title: entity.name
        }
      })
      .afterClosed()
      .subscribe(() => this.refresh());
  }
  clearFilters(): void {}

  click(id: number) {
    this.router.navigate([id, "lifters"], { relativeTo: this.route });
  }
}
