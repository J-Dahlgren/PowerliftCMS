import { DynamicModule, Module, Global } from "@nestjs/common";
import { SimpleAuthController } from "./simple-auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { SIMPLE_AUTH_PASSWORD_TOKEN } from "./tokens";
import { SimpleAuthService } from "./simple-auth.service";
import { JWT_SECRET } from "../di-tokens";
import { SimpleJwtGuard } from "./simple-jwt.guard";
import { LoggerModule } from "@dt/nest/logger";
import { SimpleJwtStrategy } from "./simple-jwt.strategy";
@Global()
@Module({})
export class SimpleAuthModule {
  static forRoot(auth: { password: string; secret: string }): DynamicModule {
    const { secret, password } = auth;
    return {
      module: SimpleAuthModule,
      imports: [
        LoggerModule,
        JwtModule.register({
          secret,
          signOptions: { expiresIn: "1w" }
        })
      ],
      providers: [
        { provide: SIMPLE_AUTH_PASSWORD_TOKEN, useValue: password },
        { provide: JWT_SECRET, useValue: secret },
        SimpleAuthService,
        SimpleJwtGuard,
        SimpleJwtStrategy
      ],
      controllers: [SimpleAuthController],
      exports: [SimpleAuthService, SimpleJwtGuard, SimpleJwtStrategy]
    };
  }
}
