import { Injectable } from "@angular/core";
import { IGroup, api } from "@dt/power-comp/shared";
import { BaseCrudApiService } from "@dt/angular/crud-api";
import { HttpClient } from "@angular/common/http";
import { LogService } from "@dt/angular/logger";

@Injectable({ providedIn: "root" })
export class GroupService extends BaseCrudApiService<IGroup> {
  constructor(protected http: HttpClient, logService: LogService) {
    super(api.group, logService.create("GroupService"));
  }
}
