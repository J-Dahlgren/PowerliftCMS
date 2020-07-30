import { HotValue, getHotValue } from "@dt/util";
import { JwtService } from "@nestjs/jwt";
import { Injectable, Inject, UnauthorizedException } from "@nestjs/common";
import { SIMPLE_AUTH_PASSWORD_TOKEN } from "./tokens";
@Injectable()
export class SimpleAuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(SIMPLE_AUTH_PASSWORD_TOKEN) protected password: string
  ) {}
  validatePassword(password: string): boolean {
    return password === this.password;
  }
  login(password: string) {
    if (!this.validatePassword(password)) {
      throw new UnauthorizedException("Password is incorrect");
    }
    return {
      access_token: this.jwtService.sign({})
    };
  }
}
