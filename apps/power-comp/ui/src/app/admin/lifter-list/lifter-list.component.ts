import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { ILifter, LiftFieldTuple, IGroup } from "@pc/power-comp/shared";
import { StateStore, IEntity, Constructor } from "@pc/util";
import { LifterService, GroupService, DownloadService } from "../../core";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { CompetitionEditService } from "../competition-edit.service";
import { ModalService, EditDialog, LanguageService } from "@pc/angular/shared";
import { PcDialogOptions, LifterDialogComponent } from "../dialog";
import { PowerCompListComponent } from "../power-comp-list.component";
import {
  debounceTime,
  filter,
  skip,
  exhaustMap,
  switchMap,
} from "rxjs/operators";
import { fromEvent, merge, BehaviorSubject } from "rxjs";
import { SnackBarService } from "@pc/angular/material";
import { TranslateService } from "@ngx-translate/core";
import { LifterListFilters } from "./lifter-list-filters";
import { ActivatedRoute, Router } from "@angular/router";
import { createFileDownload } from "@pc/angular/util";
import { UploadService } from "../../core/api/upload.service";

@Component({
  selector: "pc-lifter-list",
  templateUrl: "./lifter-list.component.html",
  styleUrls: ["./lifter-list.component.scss"],
})
export class LifterListComponent
  extends PowerCompListComponent<ILifter, LifterListFilters>
  implements AfterViewInit {
  filters = new StateStore<LifterListFilters>({
    groupId: null,
    notWeighedIn: false,
  });
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
    ...LiftFieldTuple,
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
    private language: LanguageService,
    router: Router,
    route: ActivatedRoute
  ) {
    super();
    const params = route.snapshot.queryParams;
    this.filters.modify({
      groupId: +params.groupId || null,
      notWeighedIn: params.notWeighedIn === "true",
    });
    this.filters.$.pipe(skip(1), debounceTime(100)).subscribe(
      ({ groupId, notWeighedIn }) =>
        router.navigate([], {
          queryParams: { groupId, notWeighedIn: notWeighedIn || undefined },
        })
    );
    this.subs.sink = this.refresh$
      .pipe(
        debounceTime(100),
        exhaustMap(() =>
          this.groupService.getMany(
            RequestQueryBuilder.create({
              search: {
                competitionId: this.competitionId,
              },
              sort: {
                field: "name",
                order: "ASC",
              },
            }).query()
          )
        )
      )
      .subscribe((g) => this.groups$.next(g));
  }
  ngAfterViewInit() {
    this.refresh();
    this.subs.sink = merge(
      fromEvent<KeyboardEvent>(this.textInput.nativeElement, "keydown"),
      fromEvent<KeyboardEvent>(this.textInput.nativeElement, "keyup")
    )
      .pipe(filter((event) => event.key === "Escape"))
      .subscribe(() => this.applyTextFilter(""));
  }
  protected queryBuilder(
    queryBuilder: RequestQueryBuilder
  ): RequestQueryBuilder {
    const { groupId, notWeighedIn } = this.filters.state;

    if (groupId !== null) {
      queryBuilder.search({
        groupId,
      });
    }
    if (notWeighedIn) {
      queryBuilder.search({
        bodyWeight: notWeighedIn ? { $isnull: true } : undefined,
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
    this.filters.modify(() => ({ groupId: null, notWeighedIn: false }));
    this.applyTextFilter("");
  }
  drawLot() {
    this.modalService
      .openConfirmModal({
        message: "lifter.draw-lot.confirm.message",
        title: "lifter.draw-lot.confirm.title",
      })
      .confirmed$.pipe(
        switchMap(() => this.entityService.drawLots(+this.competitionId))
      )
      .subscribe(() => this.refresh());
  }
  download() {
    this.downloadService.getRegistrationTemplate().subscribe((data) => {
      createFileDownload(
        data,
        `RegistrationTemplate_${this.language.selected.language}.xlsx`
      );
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
