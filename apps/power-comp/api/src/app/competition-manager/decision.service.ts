import {
  ProtectedStore,
  RoomEventBus,
  flattenToEvent,
  SECOND,
  Sink
} from "@dt/util";
import {
  IDecisionData,
  JudgeDecision,
  IPlatformData,
  IServerPlatformEvents,
  allHasDecided,
  majorityApprove
} from "@dt/power-comp/shared";
import { Injectable, Scope, Inject } from "@nestjs/common";
import { PLATFORM_DATA_TOKEN, PLATFORM_EVENTS_TOKEN } from "../core";
import { LogService } from "@dt/nest/logger";
import { PlatformEventService } from "./platform-event.service";
import { IPlatformHelperService } from "./platform-helper";
import { exhaustMap } from "rxjs/operators";
import { InternalEventBus } from "./internal-event-bus";
import { timer } from "rxjs";

const displayTime = 4 * SECOND;

@Injectable({ scope: Scope.TRANSIENT })
export class DecisionService extends ProtectedStore<IDecisionData>
  implements IPlatformHelperService<IDecisionData> {
  subs = new Sink();
  protected room = "-1";
  constructor(
    private logger: LogService,
    @Inject(PLATFORM_DATA_TOKEN)
    protected readonly eventBus: RoomEventBus<IPlatformData>,
    @Inject(PLATFORM_EVENTS_TOKEN)
    private serverEvents: RoomEventBus<IServerPlatformEvents>,
    private clientEvents: PlatformEventService,
    private internalEvents: InternalEventBus
  ) {
    super({
      decisions: [
        JudgeDecision.NOT_DECIDED,
        JudgeDecision.NOT_DECIDED,
        JudgeDecision.NOT_DECIDED
      ]
    });
    const clientEventsIn = clientEvents.in(() => this.room);
    const serverEventsIn = serverEvents.in(() => this.room);
    const internalEventsIn = internalEvents.in(() => this.room);

    // Secretariat decision
    this.subs.sink = clientEventsIn.on("secretariatDecision").subscribe(v => {
      const decision = v ? JudgeDecision.SUCCESS : JudgeDecision.FAILED;
      this.logger.info(`Decision from secretariat: ${JudgeDecision[decision]}`);

      const decisions = this.get("decisions").map(() => decision);
      this.set("decisions", decisions);
      serverEventsIn.emit("displayDecisions", displayTime);
      timer(displayTime).subscribe(() => internalEventsIn.emit("verdict", v));
    });

    // Reset all after display event.
    this.subs.sink = serverEventsIn
      .on("displayDecisions")
      .pipe(exhaustMap(t => timer(t)))
      .subscribe(() => this.reset());

    this.subs.sink = clientEventsIn.on("decision").subscribe(d => {
      const decisions = this.get("decisions");
      const preSet = allHasDecided(decisions);

      if (d.judgeNumber <= decisions.length + 1) {
        decisions[d.judgeNumber - 1] = JudgeDecision[d.d];
        const postSet = allHasDecided(decisions);
        this.set("decisions", decisions);

        if (!preSet && postSet) {
          // Only trigger when everyone has decided
          timer(displayTime * 0.9).subscribe(() =>
            internalEventsIn.emit(
              "verdict",
              majorityApprove(this.get("decisions"))
            )
          );
          serverEventsIn.emit("displayDecisions", displayTime);
        }
      }
    });

    this.$.pipe(flattenToEvent()).subscribe(({ type, payload }) =>
      this.serverEvents.emit(this.room, type, payload)
    );

    this.subs.sink = this.serverEvents
      .onRoomRequest(() => this.room)
      .subscribe(req => req.receiver.next(this.getState()));
  }
  init(context: string, room: string): void {
    this.room = room;
    this.logger.setContext(`${context}_Decision`);
    this.logger.trace("Initialized");
  }
  reset() {
    this.set(
      "decisions",
      this.get("decisions").map(() => JudgeDecision.NOT_DECIDED)
    );
  }
  unsubscribe() {}
  getState() {
    return this.state;
  }
}
