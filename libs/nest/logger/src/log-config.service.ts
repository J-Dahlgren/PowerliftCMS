import { RollingList, LogEvent, LogLevel } from "@dt/util";
import { Injectable, Inject, Optional } from "@nestjs/common";
import { Subject } from "rxjs";
import { logLevelToken } from "./token";
@Injectable()
export class LogConfigService {
  private reportStream = new Subject<LogEvent>();
  private logBuffer = new RollingList<LogEvent>(100);
  readonly logLevel: LogLevel;
  constructor(@Optional() @Inject(logLevelToken) logLevel: LogLevel) {
    this.logLevel = logLevel || LogLevel.off;
    this.reportStream.subscribe(event => this.logBuffer.add(event));
  }
  get log$() {
    return this.reportStream.asObservable();
  }
  reportEvent(event: LogEvent) {
    this.logBuffer.add(event);
    this.reportStream.next(event);
  }
  completeLog() {
    return this.logBuffer.list();
  }
}
