import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseApiService } from "@dt/angular/crud-api";
import { api, LifterData, IRank } from "@dt/power-comp/shared";
import { LogService } from "@dt/angular/logger";
import { IEntity } from "@dt/util";

const apiPath = api.competitionInfo;
@Injectable({ providedIn: "root" })
export class CompetitionInfoService extends BaseApiService {
  constructor(private http: HttpClient, logService: LogService) {
    super(
      { base: "api", path: apiPath.root },
      logService.create("CompetitionInfoService")
    );
  }
  liftOrder(groupId: number) {
    return this.http
      .get<IEntity<LifterData>[]>(
        `${this.path}/${apiPath.liftOrder}/${groupId}`
      )
      .pipe(this.errorTap());
  }
  result(competitionId: number | string, groupId?: number | string) {
    return this.http
      .get<IEntity<LifterData & IRank>[]>(
        `${this.path}/${apiPath.result}/${competitionId}/${groupId || ""}`
      )
      .pipe(this.errorTap());
  }
}
