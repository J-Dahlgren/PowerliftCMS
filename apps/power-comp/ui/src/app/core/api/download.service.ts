import { Injectable } from "@angular/core";
import { BaseApiService } from "@pc/angular/crud-api";
import { api } from "@pc/power-comp/shared";
import { LogService } from "@pc/angular/logger";
import { HttpClient } from "@angular/common/http";
import { LanguageService } from "@pc/angular/shared";

@Injectable({ providedIn: "root" })
export class DownloadService extends BaseApiService {
  constructor(
    private http: HttpClient,
    logService: LogService,
    private languageService: LanguageService
  ) {
    super(
      { base: "api", path: api.download.root },
      logService.create("DownloadService")
    );
  }
  getProtocol(groupId: number | string) {
    const language = this.languageService.selected.language;
    return this.http
      .get(`${this.path}/${api.download.protocol}/${groupId}`, {
        responseType: "arraybuffer",
        params: { language },
      })
      .pipe(this.errorTap());
  }
  getRegistrationTemplate() {
    const language = this.languageService.selected.language;
    return this.http
      .get(`${this.path}/${api.download.registration}`, {
        responseType: "arraybuffer",
        params: { language },
      })
      .pipe(this.errorTap());
  }
}
