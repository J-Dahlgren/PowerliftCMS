import { ILogService } from "./i-log-service";
import * as moment from "moment";
import { Optional, Injectable, InjectionToken, Inject } from "@angular/core";
import { logLevelToken } from "./log-level.token";
import { Subject } from "rxjs";
import { LogEvent, LogLevel } from "@dt/util";
const colors: {
  [key in keyof typeof LogLevel]: string;
} = {
  off: "transparent",
  error: "red",
  warn: "orangered",
  info: "darkgreen",
  debug: "mediumslateblue",
  trace: "magenta"
};
@Injectable()
export class UiLogger implements ILogService {
  constructor(
    private logLevel: LogLevel,
    private reportStream: Subject<LogEvent>
  ) {}
  private context = "";
  setContext(context: string): this {
    this.context = context;
    return this;
  }
  error(message: any, data?: any): this {
    return this.print(LogLevel.error, message, data);
  }
  warn(message: any, data?: any): this {
    return this.print(LogLevel.warn, message, data);
  }
  log(message: any, data?: any): this {
    return this.print(LogLevel.info, message, data);
  }
  debug(message: any, data?: any): this {
    return this.print(LogLevel.debug, message, data);
  }
  trace(message: any, data?: any): this {
    return this.print(LogLevel.trace, message, data);
  }
  print(logLevel: LogLevel, message: any, data?: any): this {
    const c = (str: string) => `%c${str}`;
    const event: LogEvent = {
      timestamp: Date.now(),
      logLevel,
      message,
      data,
      context: this.createContext(this.context)
    };
    this.reportStream.next(event);
    if (logLevel <= this.logLevel) {
      console.log(
        this.concat(
          c(this.timestamp(event.timestamp)),
          c(event.context),
          c(event.message)
        ),
        this.color(event.logLevel),
        "color:darkorange",
        this.color(event.logLevel)
      );
      if (typeof data !== "undefined") {
        console.log(data);
      }
    }
    return this;
  }
  private concat(...args: any[]) {
    return args.join(" ");
  }
  private color(logLevel: LogLevel) {
    const extract = LogLevel[logLevel] as keyof typeof LogLevel;
    return `color:${colors[extract]}`;
  }
  private createContext(context: string) {
    return context.length ? `[${context}]` : "";
  }
  private timestamp(time = Date.now()) {
    return moment(time)
      .format("HH:mm:ss.SSS")
      .toString();
  }
}
