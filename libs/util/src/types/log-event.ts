export enum LogLevel {
  off,
  error,
  warn,
  info,
  debug,
  trace
}

export interface LogEvent {
  timestamp: number;
  logLevel: LogLevel;
  context: string;
  message: string;
  data: any;
}
export interface ILogService {
  readonly context: string;
  setContext(context: string): this;
  error(message: any, data?: any, skipDataPrint?: boolean): this;
  warn(message: any, data?: any, skipDataPrint?: boolean): this;
  info(message: any, data?: any, skipDataPrint?: boolean): this;
  log(message: any, data?: any, skipDataPrint?: boolean): this;
  debug(message: any, data?: any, skipDataPrint?: boolean): this;
  trace(message: any, data?: any, skipDataPrint?: boolean): this;
  print(
    logLevel: LogLevel,
    message: any,
    data?: any,
    skipDataPrint?: boolean
  ): this;
}
