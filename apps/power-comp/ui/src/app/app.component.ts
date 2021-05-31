import { Component, OnInit } from "@angular/core";
import { navItems } from "./list-items";
import { LogService, UiLogger } from "@pc/angular/logger";
import { LanguageService, PaginatorIntlService } from "@pc/angular/shared";
import { SnackBarService, SnackbarColor } from "@pc/angular/material";
import { TranslateService } from "@ngx-translate/core";
import { switchMap, filter } from "rxjs/operators";
import { of, combineLatest, Observable, fromEvent } from "rxjs";
import { PlatformDataSocketService } from "./core/socket/platform-data-socket.service";
import { AppInfoService } from "./core/socket/app-info.service";
import { HeaderService } from "@pc/angular/menu";
import { filterUndefined } from "@pc/util/rxjs";

@Component({
  selector: "pc-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "Power Comp";
  navItems = navItems;
  logger: UiLogger;
  latency: Observable<number>;
  connected: Observable<boolean>;
  languageRestriction$: Observable<string | undefined>;
  constructor(
    logFactory: LogService,
    private languageService: LanguageService, // Protection if language selector isn't used
    headerService: HeaderService,
    private snackBar: SnackBarService,
    private translate: TranslateService,
    private appInfo: AppInfoService,
    private platformData: PlatformDataSocketService
  ) {
    this.logger = logFactory.create("AppComponent");
    this.latency = appInfo.latency$;
    this.connected = appInfo.connected$;
    this.languageRestriction$ = appInfo.select("languageRestriction");
    this.languageRestriction$
      .pipe(filterUndefined)
      .subscribe((lang) => this.languageService.setLanguage(lang));

    fromEvent<KeyboardEvent>(document, "keyup")
      .pipe(filter((event) => event.code === "Space" && event.ctrlKey))
      .subscribe(() => headerService.toggle());
  }
  ngOnInit() {
    this.appInfo.connected$
      .pipe(
        switchMap((connected) =>
          combineLatest([
            this.translate.get(
              `socket.${connected ? "connected" : "disconnected"}`
            ),
            of((connected ? "primary" : "warn") as SnackbarColor),
            of(connected ? 2500 : undefined),
          ])
        )
      )
      .subscribe(([text, color, duration]) =>
        this.snackBar.open(text, color, duration)
      );
  }
}
