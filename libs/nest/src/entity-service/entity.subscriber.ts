import {
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from "typeorm";
import {
  Constructor,
  ProtectedEventBus,
  IEventEmitter,
  IEntity,
} from "@pc/util";
export interface EntityEvents<T extends {}> {
  upsert: InsertEvent<T> | UpdateEvent<T>;
  insert: InsertEvent<T>;
  update: UpdateEvent<T>;
  remove: RemoveEvent<T>;
}
export interface IEntitySubscriber<T extends {}>
  extends IEventEmitter<EntityEvents<T>> {}
export abstract class EntitySubscriber<T extends {}>
  extends ProtectedEventBus<EntityEvents<T>>
  implements EntitySubscriberInterface<T>, IEntitySubscriber<T> {
  constructor() {
    super();
  }
  abstract listenTo(): Constructor<T>;

  afterInsert(event: InsertEvent<T>) {
    this._emit("insert", event);
    this._emit("upsert", event);
  }
  afterUpdate(event: UpdateEvent<T>) {
    this._emit("update", event);
    this._emit("upsert", event);
  }
  afterRemove(event: RemoveEvent<T>) {
    this._emit("remove", event);
  }
}
export type EntityEvent<T extends IEntity> =
  | InsertEvent<T>
  | UpdateEvent<T>
  | RemoveEvent<T>;
