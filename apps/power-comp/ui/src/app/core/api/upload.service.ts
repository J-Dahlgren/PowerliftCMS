import { Injectable } from "@angular/core";
import { BaseApiService } from "@pc/angular/crud-api";
import { api } from "@pc/power-comp/shared";
import { LogService } from "@pc/angular/logger";
import { HttpClient } from "@angular/common/http";
import { createFileDownload } from "@pc/angular/util";
import moment from "moment";
import { tap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class UploadService extends BaseApiService {
  constructor(private http: HttpClient, logService: LogService) {
    super(
      { base: "api", path: api.upload.root },
      logService.create("UploadService")
    );
  }
  uploadRegistration(file: File, competitionId: number) {
    return this.uploadFile(file, `${api.upload.registration}/${competitionId}`);
  }

  private uploadFile(file: File, endpoint: string) {
    const formData = new FormData();
    formData.append("file", file, file.name);
    return this.http
      .post(this.buildPath(endpoint), formData)
      .pipe(this.errorTap());
  }
}
