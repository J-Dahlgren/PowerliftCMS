import { Component, OnInit } from "@angular/core";
import { IPlatform } from "@pc/power-comp/shared";
import { EntityListComponent } from "../entity-list.component";
import { CompetitionEditService } from "../competition-edit.service";
import { PlatformService } from "../../core";
import { ModalService, EditDialog } from "@pc/angular/shared";
import { StateStore, IStateStore, IEntity, Constructor } from "@pc/util";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { PlatformDialogComponent } from "../dialog";
import { PcDialogOptions } from "../dialog";
import { PowerCompListComponent } from "../power-comp-list.component";
import { SnackBarService } from "@pc/angular/material";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "pc-platform-list",
  templateUrl: "./platform-list.component.html",
  styleUrls: ["./platform-list.component.scss"]
})
export class PlatformListComponent extends PowerCompListComponent<IPlatform> {
  constructor(
    protected editService: CompetitionEditService,
    protected entityService: PlatformService,
    protected modalService: ModalService,
    protected snack: SnackBarService,
    protected translate: TranslateService
  ) {
    super();
  }

  columns = ["name", "groups"];
  filters: StateStore<{}> = new StateStore({});
  getDialogComponentType(): Constructor<
    EditDialog<IPlatform, PcDialogOptions>
  > {
    return PlatformDialogComponent;
  }
  getEntityTitle(entity: IEntity<IPlatform>): string {
    return entity.name;
  }
  clearFilters() {}
  protected queryBuilder(
    queryBuilder: RequestQueryBuilder
  ): RequestQueryBuilder {
    return queryBuilder.setJoin({ field: "groups" });
  }
}
