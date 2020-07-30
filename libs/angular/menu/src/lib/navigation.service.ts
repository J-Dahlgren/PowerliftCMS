import { Injectable } from "@angular/core";
import { Event, NavigationEnd, Router } from "@angular/router";
import { ProtectedStore } from "@dt/util";
export interface NavigationState {
  expanded: boolean;
  currentUrl: string;
}
@Injectable({
  providedIn: "root"
})
export class NavigationService extends ProtectedStore<NavigationState> {
  constructor(private router: Router) {
    super({ expanded: false, currentUrl: "" });
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.set("currentUrl", event.urlAfterRedirects);
      }
    });
  }
  collapse() {
    this.set("expanded", false);
  }
  expand() {
    this.set("expanded", true);
  }
  toggle() {
    this.set("expanded", !this.get("expanded"));
  }
}
