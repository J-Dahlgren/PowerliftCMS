import { LogLevel } from "@dt/util";

export interface ILogService {
  setContext(context: string): this;
  error(message: any, data?: any): this;
  warn(message: any, data?: any): this;
  log(message: any, data?: any): this;
  debug(message: any, data?: any): this;
  trace(message: any, data?: any): this;
  print(logLevel: LogLevel, message: any, data?: any): this;
}
