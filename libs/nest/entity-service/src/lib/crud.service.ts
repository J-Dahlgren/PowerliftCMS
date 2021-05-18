import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Repository } from "typeorm";
import { IEntity, ILogService, IEventBus, IEventEmitter } from "@pc/util";
import { EntityEvents } from ".";
import { EntityBase } from "./entity-base";

export class CrudService<T extends EntityBase> extends TypeOrmCrudService<T> {
  constructor(
    public readonly repo: Repository<T>,
    public readonly stream: IEventEmitter<EntityEvents<T>>,
    protected readonly logger: ILogService
  ) {
    super(repo);

    logger.trace("Created");

    stream
      .on("insert")
      .subscribe(event =>
        logger.trace(
          `Inserted: ${event?.entity?.id}_${event.entity?.toString()}`
        )
      );

    stream
      .on("update")
      .subscribe(event =>
        logger.trace(
          `Updated: ${event?.entity?.id}_${event.entity?.toString()}`
        )
      );

    stream
      .on("remove")
      .subscribe(event =>
        logger.trace(
          `Removed: ${
            event?.databaseEntity.id
          }_${event.databaseEntity.toString()}`
        )
      );
  }
}
