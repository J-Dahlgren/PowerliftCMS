import { Injectable } from "@angular/core";
import { BaseCrudApiService } from "@pc/angular/crud-api";
import { api, IWeightClass } from "@pc/power-comp/shared";
import { LogService } from "@pc/angular/logger";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class WeightCategoryService extends BaseCrudApiService<IWeightClass> {
  constructor(protected http: HttpClient, logService: LogService) {
    super(api.weightCategory, logService.create("WeightCategoryService"));
  }
}
