import { RoomEventGateway, RoomGateway } from "@dt/nest/socket";
import {
  IServerPlatformEvents,
  PLATFORM_EVENTS_NSP
} from "@dt/power-comp/shared";
import { ILogService } from "@dt/util";
import { LogInject } from "@dt/nest/logger";
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
