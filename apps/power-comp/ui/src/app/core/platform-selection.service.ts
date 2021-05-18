import { Injectable, OnDestroy } from "@angular/core";
import { ProtectedStore, IEntity } from "@pc/util";
import { IPlatform, ICompetition } from "@pc/power-comp/shared";
import { distinctUntilChanged } from "rxjs/operators";
import { LogService, UiLogger } from "@pc/angular/logger";
import { SubSink } from "subsink";
import { AppInfoService } from "./socket/app-info.service";
import {
  PlatformDataSocketService,
  PlatformEventsSocketService
} from "./socket";

@Injectable({ providedIn: "root" })
export class PlatformSelectionService
  extends ProtectedStore<{
    selectedPlatform: null | IEntity<IPlatform>;
    competitions: IEntity<ICompetition>[];
  }>
  implements OnDestroy {
  private logger: UiLogger;
  private subs = new SubSink();
  constructor(
    appInfo: AppInfoService,
    private platformData: PlatformDataSocketService,
    private platformEvents: PlatformEventsSocketService,
    logService: LogService
  ) {
    super({ competitions: [], selectedPlatform: null });
    this.logger = logService.create("PlatformSelectionService");
    this.$.subscribe(state => this.logger.trace("state", state));
    this.subs.sink = appInfo
      .select("competitions")
      .subscribe(platforms => this.set("competitions", platforms));

    this.select("selectedPlatform")
      .pipe(distinctUntilChanged((a, b) => a?.id === b?.id))
      .subscribe(selected => {
        if (!!selected) {
          this.joinSockets(this.selectedToString());
        }
      });
    this.subs.sink = appInfo.connected$.subscribe(connected => {
      if (connected) {
        this.joinSockets(this.selectedToString());
      }
    });
  }

  selectedToString(): string {
    return this.get("selectedPlatform")?.id.toString() || "-1";
  }

  joinSockets(room: string) {
    this.platformData.join(room);
    this.platformEvents.join(room);
  }

  selectPlatform(platform: IEntity<IPlatform> | null) {
    this.set("selectedPlatform", platform);
  }
  get platforms() {
    return ([] as IEntity<IPlatform>[]).concat.apply(
      this.get("competitions").map(c => c.platforms)
    );
  }
  selectFirstPlatform() {
    if (this.platforms.length > 0) {
      this.logger.trace("Selecting first");
      this.set("selectedPlatform", this.platforms[0]);
    }
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
