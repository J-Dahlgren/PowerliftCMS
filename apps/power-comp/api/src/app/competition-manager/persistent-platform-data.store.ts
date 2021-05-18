import {
  ProtectedStore,
  IEntity,
  flattenToEvent,
  RoomEventBus,
  SECOND,
  InRoom,
  TimerOff,
  MINUTE,
  TimerState,
  Sink
} from "@pc/util";
import {
  PersistentPlatformData,
  LifterInfo,
  nextLifterDeterminator,
  classicCompareFunction,
  ILifter,
  LifterData,
  IPlatformData,
  AttemptInfo,
  IServerPlatformEvents,
  LiftFieldTuple,
  LiftStatus,
  DEFAULT_TIMER,
  getRank,
  classicRankSort
} from "@pc/power-comp/shared";
import { Injectable, Scope, Inject } from "@nestjs/common";
import { LifterEntityService, LifterEntity } from "@pc/power-comp/entity";
import { LogService } from "@pc/nest/logger";
import { SubSink } from "subsink";
import {
  filter,
  debounceTime,
  map,
  skip,
  auditTime,
  distinctUntilKeyChanged
} from "rxjs/operators";
import { PlatformEventService } from "./platform-event.service";
import { IPlatformHelperService } from "./platform-helper";
import moment from "moment";
import { merge } from "rxjs";
import { PLATFORM_DATA_TOKEN, PLATFORM_EVENTS_TOKEN } from "../core";
import { InternalEventBus, InternalEvents } from "./internal-event-bus";

@Injectable({ scope: Scope.TRANSIENT })
export class PersistenPlatformDataStore
  extends ProtectedStore<PersistentPlatformData>
  implements IPlatformHelperService<PersistentPlatformData> {
  subs = new Sink();
  private lock: IEntity<LifterData> | null = null;
  private lockTime: number = 60 * SECOND;
  private latestTimerState: keyof typeof TimerState = "OFF";

  room = "-1";
  internalIn: InRoom<InternalEvents>;
  serverEvents: InRoom<IServerPlatformEvents>;
  constructor(
    private logger: LogService,
    @Inject(PLATFORM_DATA_TOKEN)
    protected readonly eventBus: RoomEventBus<IPlatformData>,
    private clientEvents: PlatformEventService,
    private lifterService: LifterEntityService,
    @Inject(PLATFORM_EVENTS_TOKEN)
    serverEvents: RoomEventBus<IServerPlatformEvents>,
    internalEvents: InternalEventBus
  ) {
    super({ activeGroupId: null, ...new LifterInfo() });
    const room = this.clientEvents.in(() => this.room);
    this.internalIn = internalEvents.in(() => this.room);
    this.serverEvents = serverEvents.in(() => this.room);

    this.subs.sink = merge(
      this.lifterService.stream.any().pipe(
        filter(() => !!this.get("activeGroupId")),
        debounceTime(100),
        map(() => this.get("activeGroupId"))
      ),
      this.select("activeGroupId")
    )
      .pipe(skip(1))
      .subscribe(id => this.fetchLifters(id));

    this.subs.sink = room
      .on("activeGroupId")
      .pipe(auditTime(50))
      .subscribe(id => this.setActiveGroup(id || null));

    this.$.pipe(debounceTime(200), flattenToEvent()).subscribe(e =>
      this.eventBus.emit(this.room, e.type, e.payload)
    );

    this.subs.sink = this.eventBus
      .onRoomRequest(() => this.room)
      .subscribe(req => req.receiver.next(this.getState()));

    this.select("currentLifter").subscribe(c => this.currentLifterUpdate(c));

    this.subs.sink = this.serverEvents
      .on("liftTimer")
      .pipe(
        distinctUntilKeyChanged("state"),
        filter(t => t.state === "OFF")
      )
      .subscribe(t => {
        this.logger.debug(
          `Clock paused, preserving time: ${this.formatTime(
            t.remainingMillis || 0
          )}`
        );
        this.lockTime = t.remainingMillis || 0;
        this.latestTimerState = t.state;
      });

    this.subs.sink = this.serverEvents.on("liftTimer").subscribe(t => {
      if (t.state === "ON") {
        const c = this.get("currentLifter");
        this.lock = c;
        if (c) {
          this.logger.debug(`Locked ${c.fullname}`);
        }
      }
    });

    this.subs.sink = this.internalIn
      .on("verdict")
      .subscribe(v => this.updateLifterFromVerdict(v));
  }
  logNewLifter(lifter: IEntity<LifterData>) {
    this.logger.info(`New lifter: ${this.getAttemptText(lifter)}`);
  }
  updateLifterFromVerdict(verdict: boolean) {
    const current = this.get("currentLifter");
    const liftName = LiftFieldTuple.find(
      f => f === current?.attemptInfo.liftName
    );
    if (current && liftName && current.attemptInfo.weight) {
      const index = current.attemptInfo.attemptNumberOneIndexed - 1;
      const l = (current as IEntity<ILifter>) as LifterEntity;
      const lifter = this.lifterService.repo.create(l);
      const lifts = lifter.lifts[liftName];
      const originalWeight = current.attemptInfo.weight;
      lifts[index].status = verdict ? LiftStatus.SUCCESSFUL : LiftStatus.FAILED;
      if (index + 2 <= lifts.length) {
        lifts[index + 1].automatic = originalWeight + (verdict ? 2.5 : 0);
      }
      this.lifterService.repo
        .save(lifter)
        .catch(e => this.logger.error(`Error updating lifter`, e));
    }
  }
  currentLifterUpdate(current: IEntity<LifterData> | null) {
    if (current && this.lock) {
      const c = { id: current.id, ...current.attemptInfo } as IEntity<
        AttemptInfo
      >;
      const l = { id: this.lock.id, ...this.lock.attemptInfo } as IEntity<
        AttemptInfo
      >;
      if (c.id !== l.id) {
        // New lifter
        this.logNewLifter(current);
        this.internalIn.emit("setTimer", new TimerOff(DEFAULT_TIMER));
      } else if (
        c.liftName !== l.liftName ||
        c.attemptNumberOneIndexed !== l.attemptNumberOneIndexed
      ) {
        // Same lifter, new lift type and/or attempt number
        this.internalIn.emit("setTimer", new TimerOff(DEFAULT_TIMER));
        this.logger.info(
          `Same lifter, new attempt: ${this.getAttemptText(current)}`
        );
      } else if (this.latestTimerState === "OFF") {
        // Same lifter in lock
        this.logger.info(
          `Same lifter as before (${
            current.fullname
          }), restoring time ${this.formatTime(this.lockTime)}`
        );
        this.internalIn.emit("setTimer", new TimerOff(this.lockTime));
      }
    } else if (!!current) {
      // New lifter
      this.logNewLifter(current);
      this.internalIn.emit("setTimer", new TimerOff(DEFAULT_TIMER));
    } else if (!current) {
      this.logger.warn(`No current lifter`);
      this.internalIn.emit("setTimer", new TimerOff(DEFAULT_TIMER));
    }
  }
  setActiveGroup(activeGroupId: PersistentPlatformData["activeGroupId"]) {
    this.logger.info(`Active group: ${activeGroupId || "none"}`);
    this.set("activeGroupId", activeGroupId);
    if (!activeGroupId) {
      this.internalIn.emit("setTimer", new TimerOff(MINUTE));
      this.lock = null;
      this.lockTime = MINUTE;
    }
  }
  init(context: string, room: string) {
    this.room = room;
    this.logger.setContext(`${context}_Data`);
    this.logger.trace("Initialized");
  }
  getAttemptText(lifter: LifterData) {
    return `${lifter.fullname}, ${lifter.attemptInfo.liftName} ${lifter.attemptInfo.attemptNumberOneIndexed} - ${lifter.attemptInfo.weight} kg`;
  }
  formatTime(time: number) {
    return moment(time).format("m:ss.S");
  }
  async fetchLifters(groupId: PersistentPlatformData["activeGroupId"]) {
    this.logger.trace("Fetching lifters");
    try {
      const lifters = await this.lifterService.find({
        where: { groupId: groupId || -1 }
      });
      if (groupId && !lifters.length) {
        this.logger.warn("No lifters in group");
      }

      const { currentLifter, nextLifter, liftOrder } = nextLifterDeterminator(
        getRank(lifters, classicRankSort),
        classicCompareFunction
      );

      //const preparedLifters =
      //.orderBy(["gender", "weightCategory.minExclusive", "equipped", "lot"])
      //.value();
      this.modify(state => ({
        ...state,
        currentLifter,
        nextLifter,
        lifters: liftOrder
      }));
    } catch (e) {
      this.logger.error(e?.message || e);
    }
  }

  unsubscribe() {}
  getState() {
    return this.state;
  }
}
