import { Module } from "@nestjs/common";
import { AppInfoGateway } from "./app-info.gateway";
import { ApiModule } from "../api.module";
import { PlatformDataGateway } from "./platform-data.gateway";
import { PlatformEventsGateway } from "./platform-events.gateway";

@Module({
  imports: [ApiModule],
  providers: [AppInfoGateway, PlatformDataGateway, PlatformEventsGateway],
  exports: [AppInfoGateway, PlatformDataGateway, PlatformEventsGateway]
})
export class SocketModule {}
