import { BrowserModule, DomSanitizer } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AppComponent } from "./app.component";
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { NgxWebstorageModule } from "ngx-webstorage";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { environment } from "../environments/environment";
import { Environment } from "@pc/power-comp/shared";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "@pc/angular/material";
import { MenuModule } from "@pc/angular/menu";
import {
  SharedDialogModule,
  TableModule,
  PaginatorIntlService,
} from "@pc/angular/shared";
import { LanguageModule } from "@pc/angular/shared";
import { UiLoggerModule, LogComponent } from "@pc/angular/logger";
import { CoreModule } from "./core";
import { MiscModule } from "./misc";
import { ErrorComponent } from "./error.component";
import { AdminModule } from "./admin/admin.module";
import { HomeComponent } from "./home.component";
import { MatIconRegistry } from "@angular/material/icon";
import { MatNativeDateModule } from "@angular/material/core";
import { NgxMatMomentModule } from "@angular-material-components/moment-adapter";
import {
  NgxMatNativeDateModule,
  NGX_MAT_DATE_FORMATS,
} from "@angular-material-components/datetime-picker";
import { DateHttpInterceptor } from "@pc/angular/util";
import { DialogModule } from "./admin/dialog";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { AppSettingsComponent } from "./app-settings/app-settings.component";
import { RefereeModule } from "./referee/referee.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AuthModule, SimpleLoginComponent } from "@pc/angular/auth";

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    HomeComponent,
    AppSettingsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxWebstorageModule.forRoot(),
    UiLoggerModule.forRoot(environment.logLevel),
    CoreModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    LanguageModule.forRoot([
      { language: "en", flag: "gb" },
      { language: "sv", flag: "se" },
    ]),
    RouterModule.forRoot(
      [
        { path: "", pathMatch: "full", component: HomeComponent },
        { path: "log", component: LogComponent },
        { path: "login", component: SimpleLoginComponent },
        { path: "error", component: ErrorComponent },
        { path: "**", redirectTo: "error" },
      ],
      {
        onSameUrlNavigation: "reload",
        useHash: environment.type === Environment.DEVELOP,
        relativeLinkResolution: "legacy",
      }
    ),
    MaterialModule,
    AuthModule.forRoot(
      {
        base: "api",
        path: "auth",
      },
      "POWER_COMP_TOKEN"
    ),
    MenuModule.forRoot(true),
    SharedDialogModule.forRoot(true),
    AdminModule,
    RefereeModule,
    DialogModule,
    MiscModule,
    FlexLayoutModule,
    MatNativeDateModule,
    NgxMatMomentModule,
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: PaginatorIntlService,
    },
    {
      provide: NGX_MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: "YYYY-MM-DD HH:mm",
        },
        display: {
          dateInput: "YYYY-MM-DD HH:mm",
          monthYearLabel: "MMM YYYY",
          dateA11yLabel: "LL",
          monthYearA11yLabel: "MMMM YYYY",
        },
      },
    },
    { provide: HTTP_INTERCEPTORS, useClass: DateHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl("./assets/mdi.svg")
    );
  }
}
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
