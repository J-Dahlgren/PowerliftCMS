import { DynamicModule, Module } from "@nestjs/common";
import { LogLevel } from "@dt/util";
import { LogConfigService } from "./log-config.service";
import { LogService } from "./log.service";
import { logLevelToken, LOG_SERVICE_TOKEN } from "./token";
import { createLoggerProviders } from "./logger.provider";

@Module({})
export class CustomLoggerModule {
  static forRoot(logLevel: LogLevel = LogLevel.trace): Promise<DynamicModule> {
    return new Promise(resolve => {
      setTimeout(() => {
        const loggerProviders = createLoggerProviders();
        resolve({
          module: CustomLoggerModule,
          imports: [],
          global: true,
          providers: [
            {
              provide: logLevelToken,
              useValue: logLevel
            },
            {
              provide: LOG_SERVICE_TOKEN,
              useClass: LogService
            },
            LogConfigService,
            LogService,
            ...loggerProviders
          ],
          exports: [
            logLevelToken,
            LOG_SERVICE_TOKEN,
            LogConfigService,
            LogService,
            ...loggerProviders
          ]
        });
      }, 0);
    });
  }
}
