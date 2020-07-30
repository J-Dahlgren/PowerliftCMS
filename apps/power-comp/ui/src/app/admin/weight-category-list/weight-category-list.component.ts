import { Component } from "@angular/core";
import { IWeightClass } from "@dt/power-comp/shared";
import { CompetitionEditService } from "../competition-edit.service";
import { WeightCategoryService } from "../../core";
import { ModalService, EditDialog } from "@dt/angular/shared";
import { StateStore, IEntity, Constructor } from "@dt/util";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { WeightCategoryDialogComponent } from "../dialog";
import { PcDialogOptions } from "../dialog";
import { PowerCompListComponent } from "../power-comp-list.component";
import { SnackBarService } from "@dt/angular/material";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "pc-weight-category-list",
  templateUrl: "./weight-category-list.component.html",
  styleUrls: ["./weight-category-list.component.scss"]
})
export class WeightCategoryListComponent extends PowerCompListComponent<
  IWeightClass
> {
  constructor(
    protected editService: CompetitionEditService,
    protected entityService: WeightCategoryService,
    protected modalService: ModalService,
    protected snack: SnackBarService,
    protected translate: TranslateService
  ) {
    super();
  }

  columns = ["name", "active", "minExclusive", "maxInclusive"];
  filters: StateStore<{}> = new StateStore({});
  getDialogComponentType(): Constructor<
    EditDialog<IWeightClass, PcDialogOptions>
  > {
    return WeightCategoryDialogComponent;
  }
  getEntityTitle(entity: IEntity<IWeightClass>): string {
    return entity?.name || entity.id.toString();
  }
  clearFilters() {}
  protected queryBuilder(
    queryBuilder: RequestQueryBuilder
  ): RequestQueryBuilder {
    return queryBuilder.setJoin({ field: "groups" });
  }
}
