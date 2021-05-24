import { JwtService } from "@nestjs/jwt";
import {
  Injectable,
  Inject,
  UnauthorizedException,
  Optional,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SIMPLE_AUTH_PASSWORD_TOKEN } from "./tokens";
@Injectable()
export class SimpleAuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(SIMPLE_AUTH_PASSWORD_TOKEN) @Optional() private password?: string
  ) {}
  validatePassword(candidatePassword: string): boolean {
    return !!this.password ? candidatePassword === this.password : true;
  }
  login(candidatePassword: string) {
    if (!this.validatePassword(candidatePassword)) {
      throw new UnauthorizedException("Password is incorrect");
    }
    return {
      access_token: this.jwtService.sign({}),
    };
  }
}
