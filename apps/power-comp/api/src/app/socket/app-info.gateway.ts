import { WebSocketGateway } from "@nestjs/websockets";
import { APP_INFO_NSP, IAppInfo, AppInfo } from "@dt/power-comp/shared";
import { NspSocketGateway } from "@dt/nest/socket";
import { StateStore, ILogService } from "@dt/util";
import { LogInject } from "@dt/nest/logger";
import {
  PlatformEntityService,
  CompetitionEntityService
} from "@dt/power-comp/entity";
import { OnModuleInit } from "@nestjs/common";
import { startWith, auditTime } from "rxjs/operators";

import { of, merge } from "rxjs";

@WebSocketGateway({ namespace: APP_INFO_NSP })
export class AppInfoGateway extends NspSocketGateway<IAppInfo>
  implements OnModuleInit {
  protected store: StateStore<IAppInfo> = new StateStore<IAppInfo>(
    new AppInfo()
  );
  constructor(
    @LogInject("AppInfoGateway") logger: ILogService,
    private pService: PlatformEntityService,
    private cService: CompetitionEntityService
  ) {
    super(logger, 500);
    this.logger.trace(`Created - active on namespace: "${APP_INFO_NSP}"`);
  }
  onModuleInit() {
    this.logger.trace("onModuleInit");
    this.subs.sink = merge(
      of(undefined),
      this.cService.stream.any(),
      this.pService.stream.any()
    )
      .pipe(auditTime(500))
      .subscribe(async () => {
        this.logger.trace("Fetching platforms and competitions");
        const competitions = await this.cService.find({
          where: { active: true },
          relations: ["platforms"]
        });
        const platforms = (
          await this.pService.find({
            relations: ["competition"]
          })
        ).filter(p => p.competition?.active);
        this.store.modify(state => ({ ...state, competitions, platforms }));
      });
  }
}
