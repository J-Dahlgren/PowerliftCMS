import { Module } from "@nestjs/common";
import { SocketModule } from "../socket/socket.module";
import { PLATFORM_DATA_TOKEN, PLATFORM_EVENTS_TOKEN } from "./token";
import { PlatformDataGateway } from "../socket/platform-data.gateway";
import { PlatformEventsGateway } from "../socket/platform-events.gateway";

@Module({
  imports: [SocketModule],
  providers: [
    { provide: PLATFORM_DATA_TOKEN, useExisting: PlatformDataGateway },
    { provide: PLATFORM_EVENTS_TOKEN, useExisting: PlatformEventsGateway },
  ],
  exports: [PLATFORM_DATA_TOKEN, PLATFORM_EVENTS_TOKEN],
})
export class CoreModule {}
