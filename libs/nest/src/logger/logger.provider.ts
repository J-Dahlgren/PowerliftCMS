import { prefixesForLoggers, createProvider } from "./logger.decorator";
import { Provider } from "@nestjs/common";
import { LogService } from "./log.service";

function loggerFactory(logger: LogService, prefix: string) {
  if (prefix) {
    logger.setContext(prefix);
  }
  return logger;
}

function createLoggerProvider(prefix: string): Provider<LogService> {
  return {
    provide: createProvider(prefix),
    useFactory: logger => loggerFactory(logger, prefix),
    inject: [LogService]
  };
}

export function createLoggerProviders(): Array<Provider<LogService>> {
  return prefixesForLoggers.map(prefix => createLoggerProvider(prefix));
}
