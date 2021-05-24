import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { LogInject } from "@pc/nest/logger";
import { ILogService, RoomEventBus } from "@pc/util";
import {
  PlatformEntityService,
  PlatformEntity,
  CompetitionEntityService,
} from "@pc/power-comp/entity";
import { ModuleRef } from "@nestjs/core";
import {
  PlatformSessionService,
  IPlatformSessionService,
} from "./platform-session.service";
import { SubSink } from "subsink";
import { remove } from "lodash";
import { auditTime, filter } from "rxjs/operators";
import { IPlatformData } from "@pc/power-comp/shared";

@Injectable()
export class PlatformManagerService
  extends RoomEventBus<IPlatformData>
  implements OnModuleInit, OnModuleDestroy {
  private subs = new SubSink();
  readonly platforms: IPlatformSessionService[] = [];

  constructor(
    @LogInject("PlatformManagerService") private logger: ILogService,
    protected pService: PlatformEntityService,
    protected cService: CompetitionEntityService,
    private moduleRef: ModuleRef
  ) {
    super();
    logger.trace("Created");
  }

  onModuleInit() {
    // Pre-fetch all platforms
    this.pService
      .find()
      .then((platforms) =>
        platforms.forEach((platform) => this.createPlatformService(platform))
      );
    // Create platform when inserted
    this.subs.sink = this.pService.stream
      .on("insert")
      .subscribe((inserted) => this.createPlatformService(inserted.entity));

    // Remove platform when deleted
    this.subs.sink = this.pService.stream
      .on("remove")
      .pipe(auditTime(500)) // Platforms are self-terminating, use auditTime to remove in chunks
      .subscribe(() => this.cleanInactivePlatforms());

    this.subs.sink = this.cService.stream.on("update").subscribe((c) => {
      if (!c.entity.active) {
        this.platforms
          .filter((p) => p.entity.competitionId === c.entity.id)
          .forEach((p) => p.terminate());
        this.cleanInactivePlatforms();
      } else {
        this.createMissingPlatformsForCompetition(c.entity.id);
      }
    });
  }

  private createMissingPlatformsForCompetition(id: number) {
    this.pService
      .find({ where: { competitionId: id } })
      .then((ps) => ps.forEach((p) => this.createPlatformService(p)));
  }

  onModuleDestroy() {
    this.subs.unsubscribe();
  }

  private async createPlatformService(platform: PlatformEntity) {
    try {
      const service = await this.moduleRef.resolve(PlatformSessionService);
      if (!this.platforms.find((p) => p.entity.id === platform.id)) {
        this.platforms.push(service.init(platform));
      }
    } catch (e) {
      this.logger.error(e?.message || e);
    }
  }

  private cleanInactivePlatforms() {
    const removed = remove(this.platforms, (p) => !p.active);
    this.logger.trace(`Removed ${removed.length} platforms`);
  }
}
