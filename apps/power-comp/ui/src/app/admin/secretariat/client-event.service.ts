import { Injectable } from "@angular/core";
import { BaseApiService } from "@dt/angular/crud-api";
import { HttpClient } from "@angular/common/http";
import { LogService } from "@dt/angular/logger";
import { api, IClientPlatformEvents, ObjectPath } from "@dt/power-comp/shared";
import { PlatformSelectionService } from "../../core";

@Injectable({ providedIn: "root" })
export class ClientEventService extends BaseApiService {
  constructor(
    private http: HttpClient,
    logService: LogService,
    private platformSelection: PlatformSelectionService
  ) {
    super(
      { base: "api", path: api.events.root },
      logService.create("ClientEventService")
    );
  }

  emitEvent<K extends keyof IClientPlatformEvents>(
    event: K,
    data: IClientPlatformEvents[K]
  ) {
    const e = {
      room: this.platformId,
      data
    };
    const route = api.events[event];
    return this.http
      .post<void>(`${this.path}/${route}`, e)
      .pipe(this.errorTap());
  }

  private get platformId() {
    return this.platformSelection.get("selectedPlatform")?.id || -1;
  }
}
