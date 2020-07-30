import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { LogInject } from "@dt/nest/logger";
import { ILogService, RoomEventBus } from "@dt/util";
import { PlatformEntityService, PlatformEntity } from "@dt/power-comp/entity";
import { ModuleRef } from "@nestjs/core";
import {
  PlatformSessionService,
  IPlatformSessionService
} from "./platform-session.service";
import { SubSink } from "subsink";
import { remove } from "lodash";
import { auditTime } from "rxjs/operators";
import { IPlatformData } from "@dt/power-comp/shared";

@Injectable()
export class PlatformManagerService extends RoomEventBus<IPlatformData>
  implements OnModuleInit, OnModuleDestroy {
  private subs = new SubSink();
  readonly platforms: IPlatformSessionService[] = [];

  constructor(
    @LogInject("PlatformManagerService") private logger: ILogService,
    protected pService: PlatformEntityService,
    private moduleRef: ModuleRef
  ) {
    super();
    logger.trace("Created");
  }

  onModuleInit() {
    // Pre-fetch all platforms
    this.pService
      .find()
      .then(platforms =>
        platforms.forEach(platform => this.createPlatformService(platform))
      );
    // Create platform when inserted
    this.subs.sink = this.pService.stream
      .on("insert")
      .subscribe(inserted => this.createPlatformService(inserted.entity));

    // Remove platform when inserted
    this.subs.sink = this.pService.stream
      .on("remove")
      .pipe(auditTime(500)) // Platforms are self-terminating, use auditTime to remove in chunks
      .subscribe(() => this.cleanInactivePlatforms());
  }

  onModuleDestroy() {
    this.subs.unsubscribe();
  }

  private async createPlatformService(p: PlatformEntity) {
    try {
      const service = (
        await this.moduleRef.resolve(PlatformSessionService)
      ).init(p);
      this.platforms.push(service);
    } catch (e) {
      this.logger.error(e?.message || e);
    }
  }

  private cleanInactivePlatforms() {
    remove(this.platforms, p => !p.active);
  }
}
