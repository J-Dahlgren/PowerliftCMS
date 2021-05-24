import { Module } from "@nestjs/common";
import { PlatformManagerService } from "./platform-manager.service";
import {
  PlatformModule,
  LifterModule,
  GroupModule,
  CompetitionModule,
} from "@pc/power-comp/entity";
import { PlatformEventController } from "./platform-event.controller";
import { PlatformEventService } from "./platform-event.service";
import { PlatformSessionService } from "./platform-session.service";
import { CoreModule } from "../core";
import { PersistenPlatformDataStore } from "./persistent-platform-data.store";
import { DecisionService } from "./decision.service";
import { TimerService } from "./timer.service";
import { InternalEventBus } from "./internal-event-bus";

@Module({
  controllers: [PlatformEventController],
  imports: [
    CompetitionModule,
    PlatformModule,
    LifterModule,
    CoreModule,
    GroupModule,
  ],
  providers: [
    InternalEventBus,
    PersistenPlatformDataStore,
    TimerService,
    DecisionService,
    PlatformManagerService,
    PlatformEventService,
    PlatformSessionService,
  ],
  exports: [PlatformManagerService, PlatformEventService],
})
export class PlatformManagerModule {}
