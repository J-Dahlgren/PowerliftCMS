import { Injectable } from "@angular/core";
import { api, ILifter, LifterData } from "@dt/power-comp/shared";
import { BaseCrudApiService } from "@dt/angular/crud-api";
import { HttpClient } from "@angular/common/http";
import { LogService } from "@dt/angular/logger";

@Injectable({ providedIn: "root" })
export class LifterService extends BaseCrudApiService<ILifter> {
  constructor(protected http: HttpClient, logService: LogService) {
    super(api.lifter.root, logService.create("LifterService"));
  }
  drawLots(competitionId: number) {
    return this.http
      .post(`${this.path}/${api.lifter.drawLot}/${competitionId}`, {})
      .pipe(this.errorTap());
  }
}
