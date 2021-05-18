import { Injectable, OnDestroy, Inject } from "@angular/core";
import { ProtectedStore, extractKeys, RoomBus, InRoom } from "@pc/util";
import {
  IPlatformData,
  LifterInfo,
  PersistentPlatformData
} from "@pc/power-comp/shared";
import { filter, map } from "rxjs/operators";
import { SubSink } from "subsink";
import { PlatformSelectionService } from "./platform-selection.service";
import { PlatformDataSocketService } from "./socket";
import { PLATFORM_DATA_TOKEN } from "./token";

@Injectable({ providedIn: "root" })
export class PlatformDataService extends ProtectedStore<IPlatformData>
  implements OnDestroy {
  private subs = new SubSink();
  constructor(
    @Inject(PLATFORM_DATA_TOKEN) platformDataEvents: InRoom<IPlatformData>
  ) {
    super({
      activeGroupId: null,
      ...new LifterInfo()
    });
    this.subs.sink = platformDataEvents
      .any()
      .subscribe(({ room, type, payload }) => this.set(type, payload));
    platformDataEvents.request().subscribe();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
