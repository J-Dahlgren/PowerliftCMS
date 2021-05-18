import { NgModule } from "@angular/core";
import { ActionTableComponent } from "./action-table/action-table.component";
import { MaterialModule } from "@pc/angular/material";
import { UtilModule } from "@pc/angular/util";
import { MatPaginatorModule } from "@angular/material/paginator";
import { TableHeader } from "./table-header.directive";
import { TableContent } from "./table-content.directive";
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [CommonModule, MaterialModule, UtilModule, MatPaginatorModule],
  declarations: [ActionTableComponent, TableHeader, TableContent],
  exports: [ActionTableComponent, TableHeader, TableContent]
})
export class TableModule {}
