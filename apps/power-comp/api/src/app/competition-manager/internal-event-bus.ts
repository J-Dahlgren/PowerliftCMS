import { RoomEventBus, ILogService, Clock } from "@pc/util";
import { Injectable } from "@nestjs/common";
import { LogInject } from "@pc/nest/logger";

export interface InternalEvents {
  setTimer: Clock;

  verdict: boolean;
}
@Injectable()
export class InternalEventBus extends RoomEventBus<InternalEvents> {
  constructor(@LogInject("InternalEventBus") private logger: ILogService) {
    super();
    logger.trace("Created");
  }
}
