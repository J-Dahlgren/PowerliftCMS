import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, Inject } from "@nestjs/common";

export abstract class BaseJwtStrategy extends PassportStrategy(Strategy) {
  constructor(secret: string) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret
    });
  }
  abstract validate(payload: any): Promise<any>;
}
