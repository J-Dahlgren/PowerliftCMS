import { Injectable, OnDestroy } from "@angular/core";
import { IPlatformData, LifterInfo } from "@pc/power-comp/shared";
import { ProtectedStore } from "@pc/util";
import { SubSink } from "subsink";
import { IPlatformDataEvents } from "./token";

@Injectable({ providedIn: "root" })
export class PlatformDataService
  extends ProtectedStore<IPlatformData>
  implements OnDestroy {
  private subs = new SubSink();
  constructor(platformDataEvents: IPlatformDataEvents) {
    super({
      activeGroupId: null,
      ...new LifterInfo(),
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
