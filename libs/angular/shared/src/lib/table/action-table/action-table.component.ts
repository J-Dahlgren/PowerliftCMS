import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterContentInit,
  ViewChild,
  ContentChildren,
  QueryList,
  AfterViewInit,
  OnDestroy,
  ContentChild
} from "@angular/core";
import { Subject } from "rxjs";
import { IEntity } from "@dt/util";
import {
  MatTable,
  MatColumnDef,
  MatTableDataSource
} from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { TableContent } from "../table-content.directive";
import { TableHeader } from "../table-header.directive";
import { get } from "lodash";

@Component({
  selector: "dt-action-table",
  templateUrl: "./action-table.component.html",
  styleUrls: ["./action-table.component.scss"]
})
export class ActionTableComponent<T extends {}>
  implements
    OnInit,
    AfterContentInit,
    AfterViewInit,
    AfterContentInit,
    OnDestroy {
  protected terminate = new Subject();

  hoverClasses: string[] = [];

  @Input() highLightHover = true;
  @Input() paginate: boolean = true;
  @Input() pageSize?: number;
  @Input() pageSizes?: number[];
  @Input() dataSource!: MatTableDataSource<IEntity<T>[]>;
  @Input() columns!: string[];
  @Input() hideDelete: boolean = false;
  @Output() rowClick = new EventEmitter<IEntity<T>>();
  @Output() delete = new EventEmitter<IEntity<T>>();
  @ViewChild(MatTable, { static: true }) table!: MatTable<T>;
  @ContentChildren(MatColumnDef) columnDefs!: QueryList<MatColumnDef>;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  @ContentChild(TableContent) tableContent!: TableContent;
  @ContentChild(TableHeader) tableHeader!: TableHeader;

  constructor() {}

  ngOnInit(): void {
    this.hoverClasses = this.highLightHover ? ["row", "bg-accent"] : [];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = get;
  }

  click(entity: IEntity<T>) {
    this.rowClick.emit(entity);
  }
  deleteClick(entity: IEntity<T>) {
    this.delete.emit(entity);
  }
  ngOnDestroy() {
    this.terminate.next();
  }
  ngAfterContentInit() {
    this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
  }
}
