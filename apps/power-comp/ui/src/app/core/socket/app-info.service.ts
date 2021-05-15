import { Injectable } from "@angular/core";
import { NspSocketService } from "@dt/angular/socket";
import { IAppInfo, APP_INFO_NSP, AppInfo } from "@dt/power-comp/shared";
import { LogService, UiLogger } from "@dt/angular/logger";
import { auditTime } from "rxjs/operators";
@Injectable({ providedIn: "root" })
export class AppInfoService extends NspSocketService<IAppInfo> {
  protected logger: UiLogger;
  constructor(logService: LogService) {
    super(APP_INFO_NSP, { ...new AppInfo(), requireAuthentication: true });
    this.logger = logService.create("AppInfoService");
    this.$.pipe(auditTime(500)).subscribe(state =>
      this.logger.trace("State", state)
    );
  }
}
