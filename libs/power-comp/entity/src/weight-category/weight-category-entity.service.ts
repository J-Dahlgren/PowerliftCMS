import { CrudService } from "@pc/nest/entity-service";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ILogService } from "@pc/util";
import { LogInject } from "@pc/nest/logger";
import { WeightCategoryEntity } from "./weight-category.entity";
import { WeightCategoryEntitySubscriber } from "./weight-category-entity.subscriber";

@Injectable()
export class WeightCategoryEntityService extends CrudService<WeightCategoryEntity> {
  constructor(
    @InjectRepository(WeightCategoryEntity)
    repo: Repository<WeightCategoryEntity>,
    @LogInject("WeightCategoryEntityService") logger: ILogService,
    sub: WeightCategoryEntitySubscriber
  ) {
    super(repo, sub, logger);
  }
}
