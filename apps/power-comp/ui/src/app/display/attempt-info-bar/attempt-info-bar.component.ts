import { Component, OnInit, Inject } from "@angular/core";
import { InRoom } from "@dt/util";
import { PersistentPlatformData, LifterData } from "@dt/power-comp/shared";
import {
  PLATFORM_DATA_TOKEN,
  PlatformDataService,
  GroupService
} from "../../core";
import { Observable, of } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";

@Component({
  selector: "pc-attempt-info-bar",
  templateUrl: "./attempt-info-bar.component.html",
  styleUrls: ["./attempt-info-bar.component.scss"]
})
export class AttemptInfoBarComponent implements OnInit {
  current$: Observable<LifterData | null>;
  group$: Observable<string>;
  constructor(platformData: PlatformDataService, groupService: GroupService) {
    this.group$ = platformData.select("activeGroupId").pipe(
      switchMap(id =>
        !id
          ? of("")
          : groupService.get(id).pipe(
              map(g => g.name),
              catchError(e => "")
            )
      )
    );
    this.current$ = platformData.select("currentLifter");
  }

  ngOnInit(): void {}
}
