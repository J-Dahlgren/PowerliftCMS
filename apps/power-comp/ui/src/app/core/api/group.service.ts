import { Injectable } from "@angular/core";
import { IGroup, api } from "@pc/power-comp/shared";
import { BaseCrudApiService } from "@pc/angular/crud-api";
import { HttpClient } from "@angular/common/http";
import { LogService } from "@pc/angular/logger";

@Injectable({ providedIn: "root" })
export class GroupService extends BaseCrudApiService<IGroup> {
  constructor(protected http: HttpClient, logService: LogService) {
    super(api.group, logService.create("GroupService"));
  }
}
