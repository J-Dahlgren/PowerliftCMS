import { Component, OnInit } from "@angular/core";
import { EntityListComponent } from "../entity-list.component";
import { IGroup, ILifter } from "@dt/power-comp/shared";
import { CompetitionEditService } from "../competition-edit.service";
import { GroupService } from "../../core";
import { IStateStore, StateStore, IEntity, Constructor } from "@dt/util";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { ModalService, EditDialog } from "@dt/angular/shared";
import { GroupDialogComponent, PcDialogOptions } from "../dialog";
import { PowerCompListComponent } from "../power-comp-list.component";
import { sortBy } from "lodash";
import { SnackBarService } from "@dt/angular/material";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "pc-group-list",
  templateUrl: "./group-list.component.html",
  styleUrls: ["./group-list.component.scss"]
})
export class GroupListComponent extends PowerCompListComponent<IGroup>
  implements OnInit {
  columns = ["name", "weighInTime", "competitionTime", "lifters", "platform"];
  filters: StateStore<{}> = new StateStore({});
  constructor(
    protected editService: CompetitionEditService,
    protected entityService: GroupService,
    protected modalService: ModalService,
    protected snack: SnackBarService,
    protected translate: TranslateService
  ) {
    super();
  }

  protected queryBuilder(
    queryBuilder: RequestQueryBuilder
  ): RequestQueryBuilder {
    return queryBuilder
      .setJoin({ field: "platform" })
      .setJoin({ field: "lifters" });
  }
  getLifterNamesTooltip(lifters?: ILifter[]): string {
    return !!lifters
      ? sortBy(lifters.map(l => `${l.firstname} ${l.lastname}`)).join("\n")
      : "";
  }
  getDialogComponentType(): Constructor<EditDialog<IGroup, PcDialogOptions>> {
    return GroupDialogComponent;
  }
  clearFilters() {}
  getEntityTitle(entity: IEntity<IGroup>): string {
    return `${entity.name}`;
  }
}
