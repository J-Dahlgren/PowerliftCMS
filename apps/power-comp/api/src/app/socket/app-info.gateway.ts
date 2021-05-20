import { WebSocketGateway } from "@nestjs/websockets";
import { APP_INFO_NSP, IAppInfo, AppInfo } from "@pc/power-comp/shared";
import { NspSocketGateway } from "@pc/nest/socket";
import { StateStore, ILogService, extractKeys } from "@pc/util";
import { LogInject } from "@pc/nest/logger";
import {
  PlatformEntityService,
  CompetitionEntityService,
} from "@pc/power-comp/entity";
import { networkInterfaces } from "os";
import { OnModuleInit } from "@nestjs/common";
import { startWith, auditTime } from "rxjs/operators";

import { of, merge } from "rxjs";
import configuration from "../configuration";
import { ConfigService } from "@nestjs/config";

@WebSocketGateway({ namespace: APP_INFO_NSP })
export class AppInfoGateway
  extends NspSocketGateway<IAppInfo>
  implements OnModuleInit {
  protected store: StateStore<IAppInfo> = new StateStore<IAppInfo>(
    new AppInfo()
  );
  constructor(
    @LogInject("AppInfoGateway") logger: ILogService,
    private pService: PlatformEntityService,
    config: ConfigService,
    private cService: CompetitionEntityService
  ) {
    super(logger, 500);
    this.logger.trace(`Created - active on namespace: "${APP_INFO_NSP}"`);
    this.store.modify({ requireAuthentication: !!config.get("auth.password") });
  }
  onModuleInit() {
    this.logger.trace("onModuleInit");
    this.updateIpAdresses();
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
          relations: ["platforms"],
        });
        const platforms = (
          await this.pService.find({
            relations: ["competition"],
          })
        ).filter((p) => p.competition?.active);
        this.store.modify((state) => ({ ...state, competitions, platforms }));
      });
  }
  private updateIpAdresses() {
    const config = configuration();
    const nets = networkInterfaces();
    const ipAdresses: string[] = [];
    for (const net of extractKeys(nets).map((key) => nets[key] || [])) {
      for (const netInfo of net) {
        // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
        if (netInfo.family === "IPv4" && !netInfo.internal) {
          // tslint:disable-next-line: triple-equals
          const portString = config.port == "80" ? "" : `:${config.port}`;
          ipAdresses.push(`${netInfo.address}${portString}`);
        }
      }
    }
    this.store.modify((s) => ({ ...s, ipAdresses }));
  }
}
