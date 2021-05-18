import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { IPlatform, ICompetition } from "@pc/power-comp/shared";
import { map } from "rxjs/operators";
import { IEntity, flatten } from "@pc/util";
import { SubSink } from "subsink";
import { PlatformSelectionService } from "../../core";
import { LogService, UiLogger } from "@pc/angular/logger";

@Component({
  selector: "pc-platform-select",
  templateUrl: "./platform-select.component.html",
  styleUrls: ["./platform-select.component.scss"]
})
export class PlatformSelectComponent
  implements OnInit, OnDestroy, AfterViewInit {
  private subs = new SubSink();
  private logger: UiLogger;
  competitions$: Observable<IEntity<ICompetition>[]>;
  selected$: Observable<IEntity<IPlatform> | null>;

  constructor(
    private platformSelection: PlatformSelectionService,
    logService: LogService
  ) {
    this.logger = logService.create("PlatformSelectComponent");
    // Get platforms where its competition is active
    this.competitions$ = platformSelection.select("competitions");
    this.selected$ = combineLatest([
      platformSelection.select("selectedPlatform"),
      this.competitions$
    ]).pipe(
      map(([s, comps]) =>
        s ? { ...s, competition: comps.find(c => c.id === s.competitionId) } : s
      )
    );

    this.competitions$
      .pipe(map(competitions => flatten(competitions.map(c => c.platforms))))
      .subscribe(platforms => {
        const current = this.platformSelection.get("selectedPlatform");
        setTimeout(() => {
          this.platformSelection.selectPlatform(
            platforms.find(p => p.id === current?.id) || platforms[0] || null
          );
        }, 10);
      });
  }
  select(p: IEntity<IPlatform>) {
    this.platformSelection.selectPlatform(p);
  }
  ngOnInit(): void {}
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  ngAfterViewInit() {}
}
