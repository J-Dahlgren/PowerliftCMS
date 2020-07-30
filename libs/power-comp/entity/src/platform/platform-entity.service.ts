import { CrudService } from "@dt/nest/entity-service";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ILogService } from "@dt/util";
import { LogInject } from "@dt/nest/logger";
import { PlatformEntity } from "./platform.entity";
import { PlatformEntitySubscriber } from "./platform-entity.subscriber";

@Injectable()
export class PlatformEntityService extends CrudService<PlatformEntity> {
  constructor(
    @InjectRepository(PlatformEntity) repo: Repository<PlatformEntity>,
    @LogInject("PlatformEntityService") logger: ILogService,
    sub: PlatformEntitySubscriber
  ) {
    super(repo, sub, logger);
  }
}
