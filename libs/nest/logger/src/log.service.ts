import { LogLevel, ILogService, LogEvent } from "@dt/util";
import { Injectable, Scope, Optional, Inject } from "@nestjs/common";
import * as chalk from "chalk";
import * as moment from "moment";
import { LogConfigService } from "./log-config.service";
import { logLevelToken } from "./token";
const colors: {
  [key in keyof typeof LogLevel]: chalk.Chalk;
} = {
  off: chalk.black,
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.green,
  debug: chalk.blueBright,
  trace: chalk.magentaBright
};

@Injectable({ scope: Scope.TRANSIENT })
export class LogService implements ILogService {
  public skipIfNoContext = true;
  constructor(
    @Inject(logLevelToken) private logLevel: LogLevel,
    @Optional() private logService?: LogConfigService
  ) {}
  private _context = "";
  public get context() {
    return this._context;
  }
  setContext(context: string): this {
    this._context = context;
    return this;
  }
  protected get shouldSkip() {
    return this.skipIfNoContext && !this.context;
  }
  error(message: any, data?: any, skipDataPrint?: boolean): this {
    return this.print(LogLevel.error, message, data, skipDataPrint);
  }
  warn(message: any, data?: any, skipDataPrint?: boolean): this {
    return this.print(LogLevel.warn, message, data, skipDataPrint);
  }
  log(message: any, data?: any, skipDataPrint?: boolean): this {
    return this.info(message, data, skipDataPrint);
  }
  info(message: any, data?: any, skipDataPrint?: boolean): this {
    return this.print(LogLevel.info, message, data, skipDataPrint);
  }
  debug(message: any, data?: any, skipDataPrint?: boolean): this {
    return this.print(LogLevel.debug, message, data, skipDataPrint);
  }
  trace(message: any, data?: any, skipDataPrint?: boolean): this {
    return this.print(LogLevel.trace, message, data, skipDataPrint);
  }

  print(
    logLevel: LogLevel,
    message: any,
    data?: any,
    skipDataPrint?: boolean
  ): this {
    const event: LogEvent = {
      timestamp: Date.now(),
      logLevel,
      message,
      data,
      context: this._context || ""
    };
    this.logService?.reportEvent(event);
    if (logLevel <= this.logLevel) {
      const extract = LogLevel[logLevel] as keyof typeof LogLevel;
      if (!this.shouldSkip) {
        console.log(
          this.timestamp(event.timestamp),
          this.color(event.logLevel, `${extract.toUpperCase()}\t`),
          chalk.yellow(this.createContext(event.context)),
          this.color(event.logLevel, event.message)
        );
        if (data && !skipDataPrint) {
          console.log(data);
        }
      }
    }
    return this;
  }
  private color(logLevel: LogLevel, message: any) {
    const extract = LogLevel[logLevel] as keyof typeof LogLevel;
    const ch = colors[extract];
    return ch(message);
  }
  private createContext(context: string) {
    return context?.length ? `[${context}]` : "";
  }
  private timestamp(time = Date.now()) {
    return moment(time)
      .format("HH:mm:ss.SSS")
      .toString();
  }
}
