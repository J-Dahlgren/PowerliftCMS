import { Injectable } from "@angular/core";
import { BaseApiService } from "@pc/angular/crud-api";
import { api } from "@pc/power-comp/shared";
import { LogService } from "@pc/angular/logger";
import { HttpClient } from "@angular/common/http";
import { createFileDownload } from "@pc/angular/util";
import moment from "moment";
import { tap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class DownloadService extends BaseApiService {
  constructor(private http: HttpClient, logService: LogService) {
    super(
      { base: "api", path: api.download.root },
      logService.create("DownloadService")
    );
  }
  getProtocol(groupId: number | string) {
    return this.http
      .get(`${this.path}/${api.download.protocol}/${groupId}`, {
        responseType: "arraybuffer"
      })
      .pipe(this.errorTap());
  }
  getRegistrationTemplate() {
    return this.http
      .get(`${this.path}/${api.download.registration}`, {
        responseType: "arraybuffer"
      })
      .pipe(this.errorTap());
  }
}
