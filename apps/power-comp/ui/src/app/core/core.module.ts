import { NgModule } from "@angular/core";
import { MaterialModule } from "@dt/angular/material";
import { TranslateModule } from "@ngx-translate/core";
import { SERVER_EVENTS_TOKEN, PLATFORM_DATA_TOKEN } from "./token";
import { PlatformSelectionService } from "./platform-selection.service";
import {
  PlatformEventsSocketService,
  PlatformDataSocketService
} from "./socket";

@NgModule({
  imports: [MaterialModule, TranslateModule],
  providers: [
    {
      provide: SERVER_EVENTS_TOKEN,
      useFactory: (
        selection: PlatformSelectionService,
        serverEvents: PlatformEventsSocketService
      ) => serverEvents.in(() => selection.selectedToString()),
      deps: [PlatformSelectionService, PlatformEventsSocketService]
    },
    {
      provide: PLATFORM_DATA_TOKEN,
      useFactory: (
        selection: PlatformSelectionService,
        platformDataEvents: PlatformDataSocketService
      ) => platformDataEvents.in(() => selection.selectedToString()),
      deps: [PlatformSelectionService, PlatformDataSocketService]
    }
  ]
})
export class CoreModule {}
