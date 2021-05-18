import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { Injectable, Inject } from "@angular/core";
import { LocalStorageService } from "ngx-webstorage";
import { Observable } from "rxjs";
import { JWT_TOKEN_KEY } from "./auth.token";
import { LogService } from "@pc/angular/logger";
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    @Inject(JWT_TOKEN_KEY) private tokenKey: string,
    private storage: LocalStorageService,
    private logService: LogService
  ) {
    logService.create("AuthInterceptor");
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.storage.retrieve(this.tokenKey);
    if (token) {
      authReq = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`)
      });
    }
    return next.handle(authReq);
  }
}
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
