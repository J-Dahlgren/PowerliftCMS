import { EntitySubscriber } from "@pc/nest/entity-service";
import { CompetitionEntity } from "./competition.entity";
import { EventSubscriber, Connection } from "typeorm";
import { Constructor } from "@pc/util";

@EventSubscriber()
export class CompetitionEntitySubscriber extends EntitySubscriber<
  CompetitionEntity
> {
  constructor(connection: Connection) {
    super();
    connection.subscribers.push(this);
  }
  listenTo(): Constructor<CompetitionEntity> {
    return CompetitionEntity;
  }
}
