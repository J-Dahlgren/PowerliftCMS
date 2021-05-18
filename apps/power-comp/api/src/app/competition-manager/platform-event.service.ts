import { Injectable } from "@nestjs/common";
import { LogInject } from "@pc/nest/logger";
import { ILogService, RoomEventBus } from "@pc/util";
import { IClientPlatformEvents } from "@pc/power-comp/shared";

@Injectable()
export class PlatformEventService extends RoomEventBus<IClientPlatformEvents> {
  constructor(@LogInject("PlatformEventService") private logger: ILogService) {
    super();
    this.logger.trace("Created");
    this.any().subscribe(e => logger.debug(`${e.room}_${e.type}`, e.payload));
  }
}
