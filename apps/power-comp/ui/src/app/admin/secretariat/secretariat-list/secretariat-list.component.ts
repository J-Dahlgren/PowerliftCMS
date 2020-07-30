import { Component, OnInit, ViewChild } from "@angular/core";
import { PlatformDataService, PlatformService } from "../../../core";
import { AutoUnsubscribeComponent } from "@dt/angular/util";
import { MatTableDataSource } from "@angular/material/table";
import { IEntity } from "@dt/util";
import {
  LifterData,
  ILifter,
  LiftFieldTuple,
  protocolOrder
} from "@dt/power-comp/shared";
import { MatSort } from "@angular/material/sort";
import { Observable } from "rxjs";
import { PcDialogOptions, LifterDialogComponent } from "../../dialog";
import { LiftsDialogComponent } from "../lifts-dialog/lifts-dialog.component";
import { ModalService, DialogOptions } from "@dt/angular/shared";
import { get } from "lodash";
@Component({
  selector: "pc-secretariat-list",
  templateUrl: "./secretariat-list.component.html",
  styleUrls: ["./secretariat-list.component.scss"]
})
export class SecretariatListComponent extends AutoUnsubscribeComponent
  implements OnInit {
  columns = [
    "lot",
    "firstname",
    "lastname",
    "weightCategory.name",
    "bornYear",
    "equipped",
    "attempt",
    "attemptInfo.weight",
    "edit"
  ];
  liftFields = LiftFieldTuple;
  dataSource: MatTableDataSource<IEntity<LifterData>> = new MatTableDataSource(
    [] as IEntity<LifterData>[]
  );
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  current$: Observable<IEntity<LifterData> | null>;
  next$: Observable<IEntity<LifterData> | null>;
  constructor(
    private modalService: ModalService,
    platformDataService: PlatformDataService,
    platformService: PlatformService
  ) {
    super();
    this.dataSource.sortingDataAccessor = get;
    this.subs.sink = platformDataService
      .select("lifters")
      .subscribe(lifters => {
        this.dataSource.data = protocolOrder(lifters);
        this.dataSource.sort = this.sort;
      });
    this.current$ = platformDataService.select("currentLifter");
    this.next$ = platformDataService.select("nextLifter");
  }
  edit(entity: IEntity<ILifter>) {
    this.modalService
      .openEditModal<ILifter, DialogOptions>(LiftsDialogComponent, {
        data: {
          id: +entity.id,
          title: this.getEntityTitle(entity)
        }
      })
      .afterClosed()
      .subscribe();
  }
  editLifterInfo(entity: IEntity<ILifter>) {
    this.modalService
      .openEditModal<ILifter, PcDialogOptions>(LifterDialogComponent, {
        data: {
          id: +entity.id,
          competitionId: entity.competitionId,
          title: this.getEntityTitle(entity)
        }
      })
      .afterClosed()
      .subscribe();
  }
  getEntityTitle(entity: IEntity<ILifter>): string {
    return `${entity.firstname} ${entity.lastname}`;
  }
  ngOnInit(): void {}
}
