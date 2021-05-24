import { IEntity, ILogService, Sink } from "@pc/util";
import { filter } from "rxjs/operators";
import { cloneDeep } from "lodash";
import { IEntitySubscriber } from "./entity.subscriber";

export enum EntitySessionServiceStatus {
  NOT_INITIALIZED,
  ACTIVE,
  TERMINATED,
}

export interface IEntitySessionService<T extends IEntity> {
  readonly active: boolean;
  readonly entity: T;
  terminate(): void;
}

export abstract class EntitySessionService<T extends IEntity>
  implements IEntitySessionService<T> {
  protected _entity!: T;
  protected status: EntitySessionServiceStatus =
    EntitySessionServiceStatus.NOT_INITIALIZED;
  protected subs = new Sink();
  protected abstract readonly logger: ILogService;
  protected abstract readonly stream: IEntitySubscriber<T>;
  constructor() {}

  public get active() {
    return this.status === EntitySessionServiceStatus.ACTIVE;
  }
  public get entity() {
    return cloneDeep(this._entity);
  }
  protected abstract afterInit(): void;
  protected abstract getContext(): string;
  init(entity: T): this {
    if (this.status === EntitySessionServiceStatus.ACTIVE) {
      this.logger.error(
        `Entity session initialized again, was: ${this._entity.id}, new: ${entity.id}`
      );
      return this;
    }
    if (!this._entity) {
      this._entity = entity;
      this.logger.setContext(this.getContext());
      this.logger.trace("Initialized");
      this.status = EntitySessionServiceStatus.ACTIVE;

      this.subs.sink = this.stream
        .on("update")
        .pipe(filter((e) => e.databaseEntity.id === this._entity?.id))
        .subscribe((e) => (this._entity = e.databaseEntity));

      this.subs.sink = this.stream
        .on("remove")
        .pipe(filter((e) => e.databaseEntity.id === this._entity?.id))
        .subscribe(() => this.terminate());
      this.afterInit();
    }
    return this;
  }
  terminate() {
    if (this.status === EntitySessionServiceStatus.ACTIVE) {
      this.status = EntitySessionServiceStatus.TERMINATED;
      this.logger.debug(`Terminated`);
      this.subs.unsubscribe();
    }
  }
}
