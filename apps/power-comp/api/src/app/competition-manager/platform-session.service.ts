import {
  EntitySessionService,
  IEntitySubscriber,
  IEntitySessionService,
} from "@pc/nest/entity-service";
import { PlatformEntity, PlatformEntityService } from "@pc/power-comp/entity";
import { RoomEventBus } from "@pc/util";
import { IPlatformData } from "@pc/power-comp/shared";
import { Injectable, Scope, Inject } from "@nestjs/common";
import { LogService } from "@pc/nest/logger";
import { PLATFORM_DATA_TOKEN } from "../core/token";
import { DecisionService } from "./decision.service";
import { PersistenPlatformDataStore } from "./persistent-platform-data.store";
import { TimerService } from "./timer.service";

export interface IPlatformSessionService
  extends IEntitySessionService<PlatformEntity> {}
@Injectable({ scope: Scope.TRANSIENT })
export class PlatformSessionService
  extends EntitySessionService<PlatformEntity>
  implements IPlatformSessionService {
  protected stream: IEntitySubscriber<PlatformEntity>;

  constructor(
    protected store: PersistenPlatformDataStore,
    private pService: PlatformEntityService,
    @Inject(PLATFORM_DATA_TOKEN)
    protected readonly eventBus: RoomEventBus<IPlatformData>,
    protected logger: LogService,
    private timerService: TimerService,
    protected decisionService: DecisionService
  ) {
    super();
    this.stream = pService.stream;
    this.subs.s = [timerService, store, decisionService];
  }
  protected afterInit(): void {
    const room = this.entity.id.toString();
    const context = this.getContext();
    this.store.init(context, room);
    this.decisionService.init(context, room);
    this.timerService.init(context, room);
    this.stream = this.pService.stream;
  }
  get room() {
    return this._entity?.id.toString() || "-1";
  }
  protected getContext() {
    return `PlatformSessionService_${this.entity.id}_${this.entity.name}`;
  }
}
