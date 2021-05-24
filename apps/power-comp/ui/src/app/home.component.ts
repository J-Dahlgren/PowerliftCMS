import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { AppInfoService } from "./core";
import { environment } from "../environments/environment";
import { Environment } from "@pc/power-comp/shared";
@Component({
  template: `
    <div style="text-align:center;margin-top:10px;">
      <h1>{{ "welcome.title" | translate }}</h1>
      <div>
        <p>{{ "welcome.author" | translate }}: Jesper Dahlgren</p>
      </div>
      <div *ngIf="displayIp && ipAdresses$ | async as ipAdresses">
        <h3>{{ "welcome.ip-notice" | translate }}</h3>
        <a
          *ngFor="let ip of ipAdresses"
          target="_blank"
          mat-button
          [href]="'http://' + ip"
          >{{ ip }}</a
        >
      </div>
    </div>
  `,
})
export class HomeComponent {
  get displayIp() {
    // Display in standalone and develop
    return environment.type !== Environment.CLOUD;
  }
  ipAdresses$: Observable<string[]>;
  constructor(appInfo: AppInfoService) {
    this.ipAdresses$ = appInfo.select("ipAdresses");
  }
}
