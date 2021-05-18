import { Injectable } from "@angular/core";
import { RoomSocketService } from "@pc/angular/socket";
import {
  IServerPlatformEvents,
  PLATFORM_EVENTS_NSP
} from "@pc/power-comp/shared";
import { LogService, UiLogger } from "@pc/angular/logger";
import { AppInfoService } from "./app-info.service";

@Injectable({ providedIn: "root" })
export class PlatformEventsSocketService extends RoomSocketService<
  IServerPlatformEvents
> {
  protected logger: UiLogger;
  constructor(private logService: LogService, appInfo: AppInfoService) {
    super(PLATFORM_EVENTS_NSP);
    this.logger = logService.create("PlatformEventsService");
    this.any().subscribe(({ room, type, payload }) => {
      const platformName = appInfo.get("platforms").find(p => p.id === +room)
        ?.name;
      this.logger.trace(`${room}_${platformName}: ${type}`, payload);
    });
  }
}
