import { Injectable, Inject } from "@angular/core";
import { IServerPlatformEvents, JudgeDecision } from "@pc/power-comp/shared";
import { SERVER_EVENTS_TOKEN } from "../../core";
import { InRoom, lodashChainMap } from "@pc/util";
import { AutoUnsubscribeComponent } from "@pc/angular/util";
import { BehaviorSubject, merge, timer, of } from "rxjs";
import { switchMap, map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class PlatformDecisionService extends AutoUnsubscribeComponent {
  protected _decisions = new BehaviorSubject<(keyof typeof JudgeDecision)[]>(
    []
  );
  constructor(
    @Inject(SERVER_EVENTS_TOKEN)
    private serverEvents: InRoom<IServerPlatformEvents>
  ) {
    super();
    this.subs.sink = serverEvents
      .on("decisions")
      .pipe(
        lodashChainMap(c =>
          c.map(d => JudgeDecision[d] as keyof typeof JudgeDecision)
        )
      )
      .subscribe(d => this._decisions.next(d));
    serverEvents.request().subscribe();
  }

  public get show$() {
    return this.serverEvents
      .on("displayDecisions")
      .pipe(switchMap(t => merge(of(true), timer(t).pipe(map(() => false)))));
  }
  public get $() {
    return this._decisions.asObservable();
  }
}
