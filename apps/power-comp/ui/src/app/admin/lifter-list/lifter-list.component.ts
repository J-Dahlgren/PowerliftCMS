import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { ILifter, LiftFieldTuple, IGroup } from "@dt/power-comp/shared";
import { StateStore, IEntity, Constructor } from "@dt/util";
import { LifterService, GroupService, DownloadService } from "../../core";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { CompetitionEditService } from "../competition-edit.service";
import { ModalService, EditDialog } from "@dt/angular/shared";
import { PcDialogOptions, LifterDialogComponent } from "../dialog";
import { PowerCompListComponent } from "../power-comp-list.component";
import {
  debounceTime,
  filter,
  skip,
  exhaustMap,
  switchMap
} from "rxjs/operators";
import { fromEvent, merge, BehaviorSubject } from "rxjs";
import { SnackBarService } from "@dt/angular/material";
import { TranslateService } from "@ngx-translate/core";
import { LifterListFilters } from "./lifter-list-filters";
import { ActivatedRoute, Router } from "@angular/router";
import { createFileDownload } from "@dt/angular/util";
import { UploadService } from "../../core/api/upload.service";

@Component({
  selector: "pc-lifter-list",
  templateUrl: "./lifter-list.component.html",
  styleUrls: ["./lifter-list.component.scss"]
})
export class LifterListComponent
  extends PowerCompListComponent<ILifter, LifterListFilters>
  implements AfterViewInit {
  filters = new StateStore<LifterListFilters>({ groupId: null });
  textFilter: string = "";
  columns = [
    "lot",
    "license",
    "firstname",
    "lastname",
    "gender",
    "bornYear",
    "ageCategory",
    "team",
    "bodyWeight",
    "weightCategory.name",
    "equipped",
    "group.name",
    ...LiftFieldTuple
  ];
  @ViewChild("freeTextFilterInput") textInput!: ElementRef<HTMLInputElement>;
  @ViewChild("fileInput") fileInput!: ElementRef;
  groups$ = new BehaviorSubject<IEntity<IGroup>[]>([]);
  constructor(
    protected entityService: LifterService,
    protected groupService: GroupService,
    protected editService: CompetitionEditService,
    protected modalService: ModalService,
    protected snack: SnackBarService,
    protected translate: TranslateService,
    protected downloadService: DownloadService,
    protected upload: UploadService,
    router: Router,
    route: ActivatedRoute
  ) {
    super();
    const params = route.snapshot.queryParams;

    this.filters.set("groupId", +params.groupId || null);
    this.filters.$.pipe(skip(1), debounceTime(100)).subscribe(({ groupId }) =>
      router.navigate([], { queryParams: { groupId } })
    );
    this.subs.sink = this.refresh$
      .pipe(
        debounceTime(100),
        exhaustMap(() =>
          this.groupService.getMany(
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
      )
      .subscribe(g => this.groups$.next(g));
  }
  ngAfterViewInit() {
    this.refresh();
    this.subs.sink = merge(
      fromEvent<KeyboardEvent>(this.textInput.nativeElement, "keydown"),
      fromEvent<KeyboardEvent>(this.textInput.nativeElement, "keyup")
    )
      .pipe(filter(event => event.key === "Escape"))
      .subscribe(() => this.applyTextFilter(""));
  }
  protected queryBuilder(
    queryBuilder: RequestQueryBuilder
  ): RequestQueryBuilder {
    const groupId = this.filters.get("groupId");
    if (groupId !== null) {
      queryBuilder.setFilter({
        field: "groupId",
        operator: "eq",
        value: groupId
      });
    }
    return queryBuilder.setJoin({ field: "group" });
  }
  changeGroup(lifter: IEntity<ILifter>, group: IEntity<IGroup> | undefined) {
    if (lifter.groupId !== group?.id) {
      this.entityService
        .patch(lifter.id, { group })
        .subscribe(() => this.editService.emitEdited());
    }
  }
  getDialogComponentType(): Constructor<EditDialog<ILifter, PcDialogOptions>> {
    return LifterDialogComponent;
  }
  getEntityTitle(entity: IEntity<ILifter>): string {
    return `${entity.firstname} ${entity.lastname}`;
  }
  clearFilters() {
    this.filters.modify(() => ({ groupId: null }));
    this.applyTextFilter("");
  }
  drawLot() {
    this.modalService
      .openConfirmModal({
        message: "lifter.draw-lot.confirm.message",
        title: "lifter.draw-lot.confirm.title"
      })
      .confirmed$.pipe(
        switchMap(() => this.entityService.drawLots(+this.competitionId))
      )
      .subscribe(() => this.refresh());
  }
  download() {
    this.downloadService.getRegistrationTemplate().subscribe(data => {
      createFileDownload(data, `RegistrationTemplate_en.xlsx`);
    });
  }

  onFileSelected(files: FileList) {
    const file = files.item(0);
    if (file) {
      this.upload
        .uploadRegistration(file, +this.competitionId)
        .subscribe(() => this.refresh());
      this.fileInput.nativeElement.value = null; // Reset selected file
    }
  }
  applyTextFilter(value: string) {
    this.textFilter = value;
    this.dataSource.filter = value.toLowerCase().trim();
  }
}
