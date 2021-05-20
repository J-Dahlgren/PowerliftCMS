import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Route } from "@angular/router";
import { AuthService } from "./auth.service";
import { BaseApiOpts } from "../crud-api";
import { AUTH_DI_TOKEN, JWT_TOKEN_KEY } from "./auth.token";
import { authInterceptorProviders } from "./auth.interceptor";
import { SimpleLoginComponent } from "./simple-login";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../material";
import { TranslateModule } from "@ngx-translate/core";
export const authRoutes: Route[] = [];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
  ],
  declarations: [SimpleLoginComponent],
})
export class AuthModule {
  static forRoot(
    apiOpts: BaseApiOpts,
    tokenKey: string
  ): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        { provide: AUTH_DI_TOKEN, useValue: apiOpts },
        { provide: JWT_TOKEN_KEY, useValue: tokenKey },
        AuthService,
        ...authInterceptorProviders,
      ],
    };
  }
}
