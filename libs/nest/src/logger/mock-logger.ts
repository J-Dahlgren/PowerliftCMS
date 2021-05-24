import {
  LoggerService,
  Provider,
  Logger,
  Injectable,
  Scope,
} from "@nestjs/common";
@Injectable({ scope: Scope.TRANSIENT })
export class MockLogger extends Logger {
  constructor() {
    super();
  }
  info(message: any, context?: string) {}
  error(message: any, trace?: string, context?: string) {}
  warn(message: any, context?: string) {}
  debug(message: any, context?: string) {}
  verbose(message: any, context?: string) {}
}
export const logProvider: Provider = { provide: Logger, useClass: MockLogger };
