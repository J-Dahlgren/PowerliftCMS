import { Injectable, Optional, Inject } from "@angular/core";
import { logLevelToken } from "./log-level.token";
import { UiLogger } from "./ui-logger.service";
import { Subject } from "rxjs";
import { RollingList, LogEvent, LogLevel } from "@pc/util";
@Injectable({ providedIn: "root" })
export class LogService {
  private reportStream = new Subject<LogEvent>();
  private logBuffer = new RollingList<LogEvent>(100);
  constructor(@Optional() @Inject(logLevelToken) private logLevel: LogLevel) {
    if (!logLevel) {
      this.logLevel = LogLevel.off;
    }
    this.create("LogServiceFactory");
    this.reportStream.subscribe(event => this.logBuffer.add(event));
  }
  get log$() {
    return this.reportStream.asObservable();
  }
  completeLog() {
    return this.logBuffer.list();
  }

  create(context?: string) {
    const logger = new UiLogger(this.logLevel, this.reportStream).setContext(
      context || ""
    );
    return !!context ? logger.trace("Created") : logger;
  }
}
