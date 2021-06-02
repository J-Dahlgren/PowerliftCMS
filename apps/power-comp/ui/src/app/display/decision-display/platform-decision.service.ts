import { Injectable } from "@angular/core";
import { AutoUnsubscribeComponent } from "@pc/angular/util";
import { JudgeDecision } from "@pc/power-comp/shared";
import { lodashChainMap } from "@pc/util";
import { BehaviorSubject, merge, of, timer } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { IPlatformEvents } from "../../core";

@Injectable({ providedIn: "root" })
export class PlatformDecisionService extends AutoUnsubscribeComponent {
  protected _decisions = new BehaviorSubject<(keyof typeof JudgeDecision)[]>(
    []
  );
  constructor(private serverEvents: IPlatformEvents) {
    super();
    this.subs.sink = serverEvents
      .on("decisions")
      .pipe(
        lodashChainMap((c) =>
          c.map((d) => JudgeDecision[d] as keyof typeof JudgeDecision)
        )
      )
      .subscribe((d) => this._decisions.next(d));
    serverEvents.request().subscribe();
  }

  public get show$() {
    return this.serverEvents
      .on("displayDecisions")
      .pipe(switchMap((t) => merge(of(true), timer(t).pipe(map(() => false)))));
  }
  public get $() {
    return this._decisions.asObservable();
  }
}
