import { Injectable, OnDestroy } from "@angular/core";
import { StateStore, IEntity, SECOND, MINUTE } from "@pc/util";
import { LogService, UiLogger } from "@pc/angular/logger";
import { skip, filter, takeUntil } from "rxjs/operators";
import { Subject, interval } from "rxjs";
import { AppInfoService } from "../core";

@Injectable()
export class CompetitionEditService extends StateStore<IEntity>
  implements OnDestroy {
  protected terminate = new Subject();
  protected _onEdit = new Subject();
  protected logger: UiLogger;
  constructor(logService: LogService, appInfo: AppInfoService) {
    super({ id: 0 });

    this.logger = logService
      .create()
      .setContext("CompetitionEditService")
      .trace("Created");
    this.select("id")
      .pipe(filter(id => !!id))
      .subscribe(id =>
        this.logger.setContext(`CompetitionEditService_${id}`).trace("Id set")
      );

    // Force refresh every 30 seconds
    interval(30 * SECOND)
      .pipe(takeUntil(this.terminate))
      .subscribe(() => this.emitEdited());

    // Refresh when connection is established to server
    appInfo.connected$
      .pipe(
        takeUntil(this.terminate),
        filter(c => c)
      )
      .subscribe(() => this.emitEdited());
  }
  get onEdit$() {
    return this._onEdit.asObservable();
  }
  emitEdited() {
    this._onEdit.next();
  }
  ngOnDestroy() {
    this.terminate.next();
  }
}
