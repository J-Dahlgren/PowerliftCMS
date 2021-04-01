import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import {
  LifterData,
  IRank,
  IGroup,
  LiftFieldTuple,
  AgeCategoryName,
  AgeCategories,
  IGroupEntity
} from "@dt/power-comp/shared";
import { StateStore, IEntity, lodashChainMap } from "@dt/util";
import { SubSink } from "subsink";
import { Subject, Observable, merge } from "rxjs";
import { debounceTime, switchMap, exhaustMap } from "rxjs/operators";
import { CompetitionInfoService, GroupService } from "../../core";
import { CompetitionEditService } from "../competition-edit.service";
import { MatTableDataSource } from "@angular/material/table";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { MatSort } from "@angular/material/sort";
import { DownloadService } from "../../core";
import { createFileDownload } from "@dt/angular/util";
import moment from "moment";
type ResultData = LifterData & IRank;

@Component({
  selector: "pc-result-list",
  templateUrl: "./result-list.component.html",
  styleUrls: ["./result-list.component.scss"]
})
export class ResultListComponent implements OnInit, AfterViewInit {
  columns = [
    "lot",
    "firstname",
    "lastname",
    "gender",
    "ageCategory",
    "team",
    "weightCategory.name",
    "group.name",
    "competitionMode",
    //    "equipped",
    ...LiftFieldTuple,
    "total",
    "rank",
    "score"
  ];
  ageCategories = AgeCategories;
  liftFields = LiftFieldTuple;
  groups$: Observable<IEntity<IGroup>[]>;
  filters = new StateStore<{
    group?: IGroupEntity;
    ageCategory?: AgeCategoryName;
  }>({});
  protected subs = new SubSink();
  refresh$ = new Subject();
  elements$: Observable<IEntity<ResultData>[]>;
  dataSource: MatTableDataSource<IEntity<ResultData>> = new MatTableDataSource(
    [] as IEntity<ResultData>[]
  );
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private competitionInfoService: CompetitionInfoService,
    private editService: CompetitionEditService,
    private downloadService: DownloadService,
    groupService: GroupService
  ) {
    this.elements$ = merge(this.refresh$, this.filters.$).pipe(
      debounceTime(100),
      switchMap(() =>
        this.competitionInfoService
          .result(this.editService.get("id"), this.filters.get("group")?.id)
          .pipe(
            lodashChainMap(lifters =>
              lifters.filter(
                l =>
                  !this.filters.get("ageCategory") ||
                  l.ageCategory === this.filters.get("ageCategory")
              )
            )
          )
      )
    );
    this.groups$ = this.refresh$.pipe(
      exhaustMap(() =>
        groupService.getMany(
          RequestQueryBuilder.create({
            filter: {
              field: "competitionId",
              operator: "eq",
              value: this.competitionId
            },
            sort: {
              field: "name",
              order: "ASC"
            }
          }).query()
        )
      )
    );
  }
  get competitionId() {
    return +this.editService.get("id");
  }
  refresh() {
    this.refresh$.next();
  }
  clearFilters(): void {
    this.filters.modify(() => ({}));
  }
  ngOnInit(): void {
    this.subs.sink = this.elements$.subscribe(data => {
      this.dataSource.data = data;
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    });
  }
  download() {
    const group = this.filters.get("group");
    if (group) {
      this.downloadService.getProtocol(group.id).subscribe(data => {
        createFileDownload(
          data,
          `Result_${group.name}_${moment(Date.now()).format(
            "YYYYMMDD_HH_mm_ss"
          )}.xlsx`
        );
      });
    }
  }
  ngAfterViewInit() {
    this.refresh();
  }
}
