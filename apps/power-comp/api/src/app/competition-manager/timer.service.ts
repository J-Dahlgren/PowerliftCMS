import { Injectable, Scope, Inject } from "@nestjs/common";
import { IPlatformHelperService } from "./platform-helper";
import { LogService } from "@pc/nest/logger";
import {
  SubscriptionLike,
  RoomEventBus,
  CountdownTimer,
  MINUTE,
  Sink
} from "@pc/util";
import { InternalEventBus } from "./internal-event-bus";
import { SubSink } from "subsink";
import { PLATFORM_EVENTS_TOKEN } from "../core";
import { IServerPlatformEvents, DEFAULT_TIMER } from "@pc/power-comp/shared";
import { filter, tap } from "rxjs/operators";

@Injectable({ scope: Scope.TRANSIENT })
export class TimerService
  implements IPlatformHelperService<{}>, SubscriptionLike {
  subs = new Sink();
  private liftTimer = new CountdownTimer(200);
  room = "-1";
  constructor(
    private logger: LogService,
    @Inject(PLATFORM_EVENTS_TOKEN)
    serverEvents: RoomEventBus<IServerPlatformEvents>,
    private internalEvents: InternalEventBus
  ) {
    this.liftTimer.pause(DEFAULT_TIMER);
    const internalIn = internalEvents.in(() => this.room);
    const serverEventsIn = serverEvents.in(() => this.room);
    this.subs.sink = serverEventsIn
      .on("displayDecisions")
      .subscribe(() => internalIn.emit("setTimer", { state: "OFF" }));

    this.liftTimer.pause(DEFAULT_TIMER);
    this.subs.sink = this.internalEvents
      .onIn("setTimer", () => this.room)
      .subscribe(c => this.liftTimer.setClock(c));
    this.subs.sink = serverEvents
      .onRoomRequest(() => this.room)
      .subscribe(req => req.receiver.next(this.getState()));

    this.liftTimer
      .select("state")
      .pipe(tap(c => this.logger.debug(this.liftTimer.toString())))
      .subscribe(s =>
        serverEvents.emit(this.room, "liftTimer", this.liftTimer.state)
      );
    this.liftTimer
      .select("remainingMillis")
      .pipe(filter(t => this.liftTimer.get("state") === "OFF"))
      .subscribe(s => {
        serverEvents.emit(this.room, "liftTimer", this.liftTimer.state);
      });
  }
  init(context: string, room: string) {
    this.logger.setContext(`${context}_Timer`);
    this.logger.trace("Initialized");
    this.room = room;
  }
  unsubscribe() {}
  getState(): Partial<IServerPlatformEvents> {
    return {
      liftTimer: this.liftTimer.state
    };
  }
}
