import { EntitySubscriber } from "@dt/nest/entity-service";
import { EventSubscriber, Connection } from "typeorm";
import { Constructor } from "@dt/util";
import { LifterEntity } from "./lifter.entity";

@EventSubscriber()
export class LifterEntitySubscriber extends EntitySubscriber<LifterEntity> {
  constructor(connection: Connection) {
    super();
    connection.subscribers.push(this);
  }

  listenTo(): Constructor<LifterEntity> {
    return LifterEntity;
  }
}
