import { AutoUnsubscribeComponent } from "@dt/angular/util";
import { Component } from "@angular/core";
import { fromEvent } from "rxjs";
import { filter, map, auditTime, switchMap, tap } from "rxjs/operators";
import { ClientEventService } from "../../admin/secretariat/client-event.service";
import { StateStore } from "@dt/util";
import { JudgeDecision } from "@dt/power-comp/shared";

@Component({
  selector: "pc-decision-input",
  template: ""
})
export class DecisionInputComponent extends AutoUnsubscribeComponent {
  keys: number[] = [1, 2, 3, 4, 5, 6];
  constructor(clientEvents: ClientEventService) {
    super();
    this.subs.sink = fromEvent<KeyboardEvent>(document.body, "keydown")
      .pipe(
        filter(event => this.keys.includes(+event.key)),
        map(event => this.getDecision(+event.key))
      )
      .subscribe(d => clientEvents.emitEvent("decision", d).subscribe());
  }
  getDecision(num: number) {
    return {
      d: JudgeDecision[
        num % 2 === 0 ? JudgeDecision.FAILED : JudgeDecision.SUCCESS
      ] as keyof typeof JudgeDecision,
      judgeNumber: Math.floor((1 + num) / 2)
    };
  }
}
