import { Component, OnInit } from "@angular/core";
import { LifterData } from "@pc/power-comp/shared";
import { Observable, of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { GroupService, PlatformDataService } from "../../core";

@Component({
  selector: "pc-attempt-info-bar",
  templateUrl: "./attempt-info-bar.component.html",
  styleUrls: ["./attempt-info-bar.component.scss"],
})
export class AttemptInfoBarComponent implements OnInit {
  current$: Observable<LifterData | null>;
  group$: Observable<string>;
  constructor(platformData: PlatformDataService, groupService: GroupService) {
    this.group$ = platformData.select("activeGroupId").pipe(
      switchMap((id) =>
        !id
          ? of("")
          : groupService.get(id).pipe(
              map((g) => g.name),
              catchError((e) => "")
            )
      )
    );
    this.current$ = platformData.select("currentLifter");
  }

  ngOnInit(): void {}
}
