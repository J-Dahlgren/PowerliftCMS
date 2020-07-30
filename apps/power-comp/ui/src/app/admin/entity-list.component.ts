import { IEntity, IStateStore } from "@dt/util";
import { Input, OnInit, OnDestroy } from "@angular/core";
import { Subject, Observable, merge } from "rxjs";
import { IApiService } from "@dt/angular/crud-api";
import { filter, switchMap, auditTime, debounceTime } from "rxjs/operators";
import { SubSink } from "subsink";

export abstract class EntityListComponent<T extends {}, FilterT extends {} = {}>
  implements OnInit, OnDestroy {
  protected subs = new SubSink();
  refresh$ = new Subject();
  elements$!: Observable<IEntity<T>[]>;
  abstract filters: IStateStore<FilterT>;
  protected abstract entityService: IApiService<T>;

  constructor() {}
  abstract createQueryString(): string;
  refresh() {
    this.refresh$.next();
  }
  ngOnInit(): void {
    this.elements$ = merge(this.refresh$, this.filters.$).pipe(
      debounceTime(100),
      switchMap(() => this.entityService.getMany(this.createQueryString()))
    );
    this.refresh();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  abstract delete(entity: IEntity<T>): void;
  abstract create(): void;
  abstract edit(entity: IEntity<T>): void;
  abstract clearFilters(): void;
}
