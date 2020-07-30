import { EntitySubscriber } from "@dt/nest/entity-service";

import { EventSubscriber, Connection } from "typeorm";
import { Constructor } from "@dt/util";
import { PlatformEntity } from "./platform.entity";

@EventSubscriber()
export class PlatformEntitySubscriber extends EntitySubscriber<PlatformEntity> {
  constructor(connection: Connection) {
    super();
    connection.subscribers.push(this);
  }
  listenTo(): Constructor<PlatformEntity> {
    return PlatformEntity;
  }
}
