import { EntitySubscriber } from "@dt/nest/entity-service";
import { EventSubscriber, Connection } from "typeorm";
import { Constructor } from "@dt/util";
import { GroupEntity } from "./group.entity";

@EventSubscriber()
export class GroupEntitySubscriber extends EntitySubscriber<GroupEntity> {
  constructor(connection: Connection) {
    super();
    connection.subscribers.push(this);
  }
  listenTo(): Constructor<GroupEntity> {
    return GroupEntity;
  }
}
