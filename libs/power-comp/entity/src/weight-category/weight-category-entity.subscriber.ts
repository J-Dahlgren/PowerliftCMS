import { EntitySubscriber } from "@dt/nest/entity-service";

import { EventSubscriber, Connection } from "typeorm";
import { Constructor } from "@dt/util";
import { WeightCategoryEntity } from "./weight-category.entity";

@EventSubscriber()
export class WeightCategoryEntitySubscriber extends EntitySubscriber<
  WeightCategoryEntity
> {
  constructor(connection: Connection) {
    super();
    connection.subscribers.push(this);
  }
  listenTo(): Constructor<WeightCategoryEntity> {
    return WeightCategoryEntity;
  }
}
