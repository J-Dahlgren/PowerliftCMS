import { Injectable } from "@angular/core";
import { BaseCrudApiService } from "@pc/angular/crud-api";
import { IPlatform, api } from "@pc/power-comp/shared";
import { LogService } from "@pc/angular/logger";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class PlatformService extends BaseCrudApiService<IPlatform> {
  constructor(protected http: HttpClient, logService: LogService) {
    super(api.platform, logService.create("PlatformService"));
  }
}
