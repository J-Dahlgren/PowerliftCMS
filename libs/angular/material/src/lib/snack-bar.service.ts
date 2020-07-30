import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
export type SnackbarColor = "primary" | "accent" | "warn";

@Injectable({
  providedIn: "root"
})
export class SnackBarService {
  constructor(private snack: MatSnackBar) {}
  open(message: string, panelClass: SnackbarColor, duration?: number) {
    this.snack.open(message, "X", {
      panelClass: `snack-bar-${panelClass}`,
      duration
    });
  }
}
