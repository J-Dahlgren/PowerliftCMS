import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
export type SnackbarColor = "primary" | "accent" | "warn";

@Injectable({
  providedIn: "root",
})
export class SnackBarService {
  constructor(
    private snack: MatSnackBar,
    private translateService: TranslateService
  ) {}
  open(message: string, panelClass: SnackbarColor, duration?: number) {
    this.snack.open(message, "X", {
      panelClass: `snack-bar-${panelClass}`,
      duration,
    });
  }
  openTranslate(message: string, panelClass: SnackbarColor, duration?: number) {
    this.translateService.get(message).subscribe((translatedMessage) =>
      this.snack.open(translatedMessage, "X", {
        panelClass: `snack-bar-${panelClass}`,
        duration,
      })
    );
  }
}
