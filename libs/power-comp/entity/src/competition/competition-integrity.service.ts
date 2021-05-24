import { Injectable, OnModuleDestroy } from "@nestjs/common";
import {
  WeightCategoryEntityService,
  WeightCategoryEntity,
} from "../weight-category";
import { LifterEntityService, LifterEntity } from "../lifter";
import { SubSink } from "subsink";
import { getWeightClass } from "@pc/power-comp/shared";
import { LogInject } from "@pc/nest/logger";
import { ILogService, sleep, SECOND } from "@pc/util";
import { InsertEvent, UpdateEvent } from "typeorm";
import { EntityEvent } from "@pc/nest/entity-service";
import { debounceTime, delay } from "rxjs/operators";
import { isEqual } from "lodash";

@Injectable()
export class CompetitionIntegrityService implements OnModuleDestroy {
  private subs = new SubSink();
  constructor(
    @LogInject("CompetitionIntegrityService") private logger: ILogService,
    private weightCategoryService: WeightCategoryEntityService,

    private lifterService: LifterEntityService
  ) {
    this.subs.sink = lifterService.stream
      .on("upsert")
      .subscribe((e) => this.onLifterUpdate(e));

    setTimeout(() => {
      logger.trace("Listening on weight catefory changes");
      this.subs.sink = weightCategoryService.stream.any().subscribe((e) => {
        const event = e.payload;
        const id = event.entity?.competitionId;
        if (id) {
          this.onCategoryUpdate(id, event);
        }
      });
    }, 30 * SECOND);
  }
  protected async onLifterUpdate(
    event: InsertEvent<LifterEntity> | UpdateEvent<LifterEntity>
  ) {
    try {
      const lifter = event.entity;
      const eventRepo = event.manager.getRepository(LifterEntity);
      const categories = await this.weightCategoryService.find({
        where: {
          competitionId: lifter.competitionId,
          gender: lifter.gender,
          active: true,
        },
      });

      const nextClass = getWeightClass(lifter, categories);
      if (!isEqual(nextClass, lifter.weightCategory)) {
        // Prevent infinite loop
        lifter.weightCategory = getWeightClass(lifter, categories);
        await eventRepo.save(lifter);
      }
    } catch (err) {
      this.logger.error(
        `Error occured during weight category update: ${err?.message}`,
        err
      );
    }
  }
  protected async onCategoryUpdate(
    competitionId: number | string,
    event: EntityEvent<WeightCategoryEntity>
  ) {
    try {
      const weightClasses = await event.manager
        .getRepository(WeightCategoryEntity)
        .find({ where: { competitionId, active: true } });
      const lifterRepo = this.lifterService.repo;
      const lifters = await lifterRepo.find({ where: { competitionId } });

      for (const lifter of lifters) {
        lifter.weightCategory = getWeightClass(lifter, weightClasses);
        await sleep(100);
        await lifterRepo.save(lifter);
      }
    } catch (err) {
      this.logger.error(
        `Error occured during weight category update: ${err?.message}`,
        err
      );
    }
  }
  onModuleDestroy() {
    this.subs.unsubscribe();
  }
}
