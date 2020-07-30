import { CrudService } from "@dt/nest/entity-service";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ILogService } from "@dt/util";
import { LogInject } from "@dt/nest/logger";
import { GroupEntity } from "./group.entity";
import { GroupEntitySubscriber } from "./group-entity.subscriber";

@Injectable()
export class GroupEntityService extends CrudService<GroupEntity> {
  constructor(
    @InjectRepository(GroupEntity) repo: Repository<GroupEntity>,
    @LogInject("GroupEntityService") logger: ILogService,
    sub: GroupEntitySubscriber
  ) {
    super(repo, sub, logger);
  }
}
