import { Component, Input, OnInit } from "@angular/core";
import {
  defaultPlatformWeights,
  getPlateLoading,
  IWeightPlate,
} from "@pc/power-comp/shared";
import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { PlatformDataService, PlatformSelectionService } from "../../core";

@Component({
  selector: "pc-plate-load",
  templateUrl: "./plate-load.component.html",
  styleUrls: ["./plate-load.component.scss"],
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
      .pipe(map((lifter) => lifter?.attemptInfo.weight || 0));

    const weights$ = this.pSelection
      .select("selectedPlatform")
      .pipe(map((platform) => platform?.weights || defaultPlatformWeights));

    this.plates$ = combineLatest([attemptWeight$, weights$]).pipe(
      map(([attemptWeight, weights]) => getPlateLoading(attemptWeight, weights))
    );
  }
}
