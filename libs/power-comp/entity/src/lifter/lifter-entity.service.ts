import { CrudService } from "@pc/nest/entity-service";
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ILogService, generateArray, MINUTE } from "@pc/util";
import { LogInject } from "@pc/nest/logger";
import { LifterEntity } from "./lifter.entity";
import { LifterEntitySubscriber } from "./lifter-entity.subscriber";
import { WeightCategoryEntityService } from "../weight-category";
import { SubSink } from "subsink";
import { merge } from "rxjs";
import { getWeightClass } from "@pc/power-comp/shared";

@Injectable()
export class LifterEntityService
  extends CrudService<LifterEntity>
  implements OnModuleInit, OnModuleDestroy {
  private subs = new SubSink();
  constructor(
    @InjectRepository(LifterEntity) repo: Repository<LifterEntity>,
    @LogInject("LifterEntityService") logger: ILogService,
    sub: LifterEntitySubscriber
  ) {
    super(repo, sub, logger);
  }
  async drawLot(competitionId: number) {
    const lifters = await this.find({ where: { competitionId } });
    const lots = generateArray(lifters.length, 1);

    this.logger.info(`Generating lots for competition ${competitionId}`);

    for (const lifter of lifters) {
      const index = Math.floor(Math.random() * lots.length);
      const lot = lots.splice(index, 1)[0];
      lifter.lot = lot;
    }
    await this.repo.save(lifters);
  }
  onModuleDestroy() {
    this.subs.unsubscribe();
  }
  onModuleInit() {}
}
