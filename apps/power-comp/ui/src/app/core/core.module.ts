import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { MaterialModule } from "@pc/angular/material";
import { PlatformSelectionService } from "./platform-selection.service";
import {
  PlatformDataSocketService,
  PlatformEventsSocketService,
} from "./socket";
import { IPlatformDataEvents, IPlatformEvents } from "./token";

@NgModule({
  imports: [MaterialModule, TranslateModule],
  providers: [
    {
      provide: IPlatformEvents,
      useFactory: (
        selection: PlatformSelectionService,
        serverEvents: PlatformEventsSocketService
      ) => serverEvents.in(() => selection.selectedToString()),
      deps: [PlatformSelectionService, PlatformEventsSocketService],
    },
    {
      provide: IPlatformDataEvents,
      useFactory: (
        selection: PlatformSelectionService,
        platformDataEvents: PlatformDataSocketService
      ) => platformDataEvents.in(() => selection.selectedToString()),
      deps: [PlatformSelectionService, PlatformDataSocketService],
    },
  ],
})
export class CoreModule {}
