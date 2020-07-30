import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { logLevelToken } from "./log-level.token";
import { LogService } from "./log-factory.service";
import { LogLevel } from "@dt/util";
import { LogComponent } from "./log/log.component";

@NgModule({
  imports: [CommonModule],
  declarations: [LogComponent]
})
export class UiLoggerModule {
  static forRoot(logLevel: LogLevel): ModuleWithProviders {
    return {
      ngModule: UiLoggerModule,
      providers: [
        LogService,
        {
          provide: logLevelToken,
          useValue: logLevel
        }
      ]
    };
  }
}
