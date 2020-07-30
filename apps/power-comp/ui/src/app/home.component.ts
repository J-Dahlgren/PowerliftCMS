import { Component } from "@angular/core";

@Component({
  template: `
    <div style="text-align:center;margin-top:10px;">
      <h1>{{ "welcome.title" | translate }}</h1>
    </div>
  `
})
export class HomeComponent {}
