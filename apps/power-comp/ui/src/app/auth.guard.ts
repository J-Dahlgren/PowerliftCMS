import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { AuthService } from "@pc/angular/auth";
import { timer } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
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

    this.appInfo
      .select("requireAuthentication")
      .pipe(
        takeUntil(timer(1000)),
        filter(requireAuth => !requireAuth)
      )
      .subscribe(() => this.router.navigate([state.url]));

    // not logged in so redirect to login page with the return url
    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
