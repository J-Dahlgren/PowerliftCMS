import { Injectable } from "@angular/core";
import { BaseCrudApiService } from "@dt/angular/crud-api";
import { api, IWeightClass } from "@dt/power-comp/shared";
import { LogService } from "@dt/angular/logger";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class WeightCategoryService extends BaseCrudApiService<IWeightClass> {
  constructor(protected http: HttpClient, logService: LogService) {
    super(api.weightCategory, logService.create("WeightCategoryService"));
  }
}
