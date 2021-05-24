import { Component } from "@angular/core";

@Component({
  template: `
    <h1 style="text-align:center;margin-top:20px;">
      {{ "navigation.not-found" | translate }}
    </h1>
    <h3 style="text-align:center;">
      {{ "navigation.not-found.message" | translate }}
    </h3>
  `,
})
export class ErrorComponent {}
