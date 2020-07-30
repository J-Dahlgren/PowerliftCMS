import { Injectable } from "@angular/core";
import { BaseCrudApiService } from "@dt/angular/crud-api";
import { ICompetition, api } from "@dt/power-comp/shared";
import { LogService } from "@dt/angular/logger";
import { HttpClient } from "@angular/common/http";
import { RequestQueryBuilder } from "@nestjsx/crud-request";
@Injectable({ providedIn: "root" })
export class CompetitionService extends BaseCrudApiService<ICompetition> {
  constructor(protected http: HttpClient, logService: LogService) {
    super(api.competition, logService.create("CompetitionService"));
  }
  getAllRelations(id: number | string) {
    const query = RequestQueryBuilder.create()
      .setJoin({ field: "platforms" })
      .setJoin({ field: "groups" })
      .setJoin({ field: "lifters" })
      .query();

    return this.get(id, query);
  }
}
