import { Injectable } from "@angular/core";
import { ProtectedStore } from "@pc/util";
export interface HeaderState {
  visible: boolean;
}
@Injectable({
  providedIn: "root"
})
export class HeaderService extends ProtectedStore<HeaderState> {
  constructor() {
    super({ visible: true });
  }
  show() {
    this.set("visible", true);
  }
  hide() {
    this.set("visible", false);
  }
  toggle() {
    this.set("visible", !this.get("visible"));
  }
}
