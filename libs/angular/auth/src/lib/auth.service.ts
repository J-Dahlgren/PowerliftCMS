import { BaseApiService, BaseApiOpts } from "@pc/angular/crud-api";
import { Inject, Injectable, OnInit } from "@angular/core";
import { AUTH_DI_TOKEN, JWT_TOKEN, JWT_TOKEN_KEY } from "./auth.token";
import { LogService } from "@pc/angular/logger";
import { HttpClient } from "@angular/common/http";
import { LocalStorageService } from "ngx-webstorage";
import { shareReplay, tap, map, distinctUntilChanged } from "rxjs/operators";
import { AccessToken, JwtPayload } from "@pc/util";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, merge, interval, of } from "rxjs";
@Injectable()
export class AuthService extends BaseApiService {
  private jwtService: JwtHelperService = new JwtHelperService();
  constructor(
    @Inject(AUTH_DI_TOKEN) opts: BaseApiOpts,
    @Inject(JWT_TOKEN_KEY) private tokenKey: string,
    private http: HttpClient,
    private storage: LocalStorageService,
    logService: LogService
  ) {
    super(opts, logService.create("AuthService"));
    this.isLoggedIn$
      .pipe(distinctUntilChanged())
      .subscribe(isLoggedIn => this.logger.trace(`Logged in: ${isLoggedIn}`));
  }
  get isLoggedIn() {
    return !this.jwtService.isTokenExpired(this.token);
  }
  get token(): string | undefined {
    return this.storage.retrieve(this.tokenKey);
  }
  get token$(): Observable<string | undefined> {
    return this.storage.observe(this.tokenKey);
  }
  decodedToken$<T extends JwtPayload = JwtPayload>() {
    return this.token$.pipe(
      map(token => this.jwtService.decodeToken(this.token) as T | null)
    );
  }
  get isLoggedIn$() {
    return merge(
      of(this.token),
      this.token$,
      interval(1000 * 60).pipe(map(() => this.token))
    ).pipe(
      map(token => !this.jwtService.isTokenExpired(token)),
      distinctUntilChanged()
    );
  }
  decode<T extends JwtPayload = JwtPayload>(): null | T {
    return this.jwtService.decodeToken(this.token) as T | null;
  }

  login(body: any) {
    return this.http.post<AccessToken>(`${this.path}/login`, body).pipe(
      shareReplay(),
      tap(resp => this.storage.store(this.tokenKey, resp.access_token))
    );
  }
  logOut() {
    this.storage.clear(this.tokenKey);
  }
}
