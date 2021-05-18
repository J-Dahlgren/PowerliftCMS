import { RoomEventGateway, RoomGateway } from "@pc/nest/socket";
import {
  IServerPlatformEvents,
  PLATFORM_EVENTS_NSP
} from "@pc/power-comp/shared";
import { ILogService } from "@pc/util";
import { LogInject } from "@pc/nest/logger";
import { WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway({ namespace: PLATFORM_EVENTS_NSP })
export class PlatformEventsGateway extends RoomGateway<IServerPlatformEvents> {
  constructor(
    @LogInject("PlatformEventsGateway") protected logger: ILogService
  ) {
    super();
    this.logger.trace(
      `Created - active on namespace: "${PLATFORM_EVENTS_NSP}"`
    );
  }
}
