import { CrudService } from "@dt/nest/entity-service";
import { Injectable, Scope } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ILogService } from "@dt/util";
import { LogInject } from "@dt/nest/logger";
import { CompetitionEntity } from "./competition.entity";
import { CompetitionEntitySubscriber } from "./competition-entity.subscriber";

@Injectable()
export class CompetitionEntityService extends CrudService<CompetitionEntity> {
  constructor(
    @InjectRepository(CompetitionEntity) repo: Repository<CompetitionEntity>,
    @LogInject("CompetitionEntityService") logger: ILogService,
    sub: CompetitionEntitySubscriber
  ) {
    super(repo, sub, logger);
  }
}
