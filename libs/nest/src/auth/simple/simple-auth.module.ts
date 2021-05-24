import { DynamicModule, Module, Global } from "@nestjs/common";
import { SimpleAuthController } from "./simple-auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { SIMPLE_AUTH_PASSWORD_TOKEN } from "./tokens";
import { SimpleAuthService } from "./simple-auth.service";
import { JWT_SECRET } from "../di-tokens";
import { LoggerModule } from "@pc/nest/logger";
import { SimpleJwtStrategy } from "./simple-jwt.strategy";
import { SimpleJwtGuard } from "./simple-jwt.guard";
@Module({})
export class SimpleAuthModule {
  static forRoot(auth: { password?: string; secret?: string }): DynamicModule {
    const { secret, password } = auth;
    const tokenProviders = [
      { provide: SIMPLE_AUTH_PASSWORD_TOKEN, useValue: password },
      { provide: JWT_SECRET, useValue: secret },
    ];
    return {
      module: SimpleAuthModule,
      global: true,
      imports: [
        LoggerModule,
        JwtModule.register({
          secret,
          signOptions: { expiresIn: "1w" },
        }),
      ],
      providers: [
        ...tokenProviders,
        SimpleAuthService,
        SimpleJwtGuard,
        SimpleJwtStrategy,
      ],
      controllers: [SimpleAuthController],
      exports: [
        SIMPLE_AUTH_PASSWORD_TOKEN,
        JWT_SECRET,
        SimpleAuthService,
        SimpleJwtGuard,
        SimpleJwtStrategy,
      ],
    };
  }
}
