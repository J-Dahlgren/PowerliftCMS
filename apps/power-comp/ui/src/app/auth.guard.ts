import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "@pc/angular/auth";

import { debounceTime, map, take, tap } from "rxjs/operators";
import { AppInfoService } from "./core";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private appInfo: AppInfoService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (
      !this.appInfo.get("requireAuthentication") ||
      this.authenticationService.isLoggedIn
    ) {
      return true;
    }
    // This solves initial navigation when AppInfo hasn't been synced
    return this.appInfo.select("requireAuthentication").pipe(
      map(
        (requireAuth) => !requireAuth || this.authenticationService.isLoggedIn
      ),
      debounceTime(200),
      take(1),
      tap((allow) => {
        if (!allow) {
          this.router.navigate(["/login"], {
            queryParams: { returnUrl: state.url },
          });
        }
      })
    );
  }
}
