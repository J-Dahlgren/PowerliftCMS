import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";
import {
  LifterData,
  LiftFieldExt,
  SquatRackSettingsEnum,
  ISquatSettings,
  IBenchPressSettings,
} from "@pc/power-comp/shared";
import { TranslateService } from "@ngx-translate/core";
import { switchMap } from "rxjs/operators";

@Component({
  selector: "pc-lifter-info",
  templateUrl: "./lifter-info.component.html",
  styleUrls: ["./lifter-info.component.scss"],
})
export class LifterInfoComponent implements OnInit {
  @Input() lifter!: Observable<LifterData | null>;
  constructor(private translateService: TranslateService) {}

  getSquatSettings(lifter: LifterData): ISquatSettings | undefined {
    if (lifter.attemptInfo.liftName === "squat") {
      return lifter.settings.squat;
    }
    return undefined;
  }
  getBenchSettings(lifter: LifterData): IBenchPressSettings | undefined {
    if (lifter.attemptInfo.liftName === "bench") {
      return lifter.settings.bench;
    }
    return undefined;
  }

  ngOnInit(): void {}
}
