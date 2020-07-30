import { Component, OnInit, Input } from "@angular/core";
import { PlatformDataService, PlatformSelectionService } from "../../core";
import { map, switchMap } from "rxjs/operators";
import { of, combineLatest, Observable } from "rxjs";
import {
  defaultPlatformWeights,
  findValidPlateCombo,
  getPlateLoading,
  IWeightPlate
} from "@dt/power-comp/shared";

@Component({
  selector: "pc-plate-load",
  templateUrl: "./plate-load.component.html",
  styleUrls: ["./plate-load.component.scss"]
})
export class PlateLoadComponent implements OnInit {
  @Input() next = false;
  @Input() showWeight = true;
  plates$!: Observable<IWeightPlate[]>;

  constructor(
    private platformDataService: PlatformDataService,
    private pSelection: PlatformSelectionService
  ) {}

  getCssClass(weight: number) {
    return `PL_${weight.toString()}`.replace(".", "_");
  }

  ngOnInit(): void {
    const attemptWeight$ = this.platformDataService
      .select(this.next ? "nextLifter" : "currentLifter")
      .pipe(map(lifter => lifter?.attemptInfo.weight || 0));

    const weights$ = this.pSelection
      .select("selectedPlatform")
      .pipe(map(platform => platform?.weights || defaultPlatformWeights));

    this.plates$ = combineLatest([attemptWeight$, weights$]).pipe(
      map(([attemptWeight, weights]) => getPlateLoading(attemptWeight, weights))
    );
  }
}
