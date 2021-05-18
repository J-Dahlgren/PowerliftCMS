import { UiLogger } from "@pc/angular/logger";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
import { catchError, tap, map, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { IEntity } from "@pc/util";
import { Observable } from "rxjs";
import { minDelay } from "@pc/util";

export interface IApiService<T extends object> {
  get(id: string | number, queryStr: string): Observable<IEntity<T>>;
  getMany(queryStr: string): Observable<IEntity<T>[]>;
  create(body: T): Observable<IEntity<T>>;
  update(body: IEntity<T>): Observable<IEntity<T>>;
  patch(id: number | string, body: Partial<T>): Observable<IEntity<T>>;
  delete(id: string | number): Observable<void>;
}
export abstract class BaseCrudApiService<T extends object>
  implements IApiService<T> {
  protected abstract http: HttpClient;
  constructor(
    protected readonly entityName: string,
    protected logger: UiLogger
  ) {
    logger.log(`Path: /api/${entityName}`);
  }
  protected get path() {
    return `/api/${this.entityName}`;
  }
  protected query(queryStr: string) {
    return queryStr ? `?${queryStr}` : "";
  }
  get(id: string | number, queryStr: string = "") {
    return this.http
      .get<IEntity<T>>(`${this.path}/${id}${this.query(queryStr)}`)
      .pipe(this.errorTap());
  }
  getMany(queryStr: string = "") {
    return this.http
      .get<IEntity<T>[]>(`${this.path}${this.query(queryStr)}`)
      .pipe(this.errorTap());
  }
  create(body: T) {
    return this.http.post<IEntity<T>>(this.path, body).pipe(this.errorTap());
  }
  update(body: IEntity<T>) {
    return this.http
      .put<IEntity<T>>(`${this.path}/${body.id}`, body)
      .pipe(this.errorTap());
  }
  patch(id: number | string, partialBody: Partial<T>) {
    return this.http
      .patch<IEntity<T>>(`${this.path}/${id}`, partialBody)
      .pipe(this.errorTap());
  }
  delete(id: string | number) {
    return this.http.delete<void>(`${this.path}/${id}`).pipe(this.errorTap());
  }
  protected errorTap<K>() {
    return tap<K>(
      () => {},
      err => this.logger.error(err?.message ?? "An error occurred")
    );
  }
}
