import { WebSocketGateway } from "@nestjs/websockets";
import { PLATFORM_NSP, IPlatformData } from "@dt/power-comp/shared";
import { RoomGateway } from "@dt/nest/socket";
import { LogInject } from "@dt/nest/logger";
import { ILogService } from "@dt/util";
import { PlatformManagerService } from "../competition-manager/platform-manager.service";

@WebSocketGateway({ namespace: PLATFORM_NSP })
export class PlatformDataGateway extends RoomGateway<IPlatformData> {
  constructor(@LogInject("PlatformDataGateway") protected logger: ILogService) {
    super();
    logger.trace(`Created - active on namespace "${PLATFORM_NSP}"`);
  }
}
