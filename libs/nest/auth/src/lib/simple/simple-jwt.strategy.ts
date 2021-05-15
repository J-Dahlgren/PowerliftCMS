import { BaseJwtStrategy } from "../base";
import { Inject, Optional } from "@nestjs/common";
import { JWT_SECRET } from "../di-tokens";

export class SimpleJwtStrategy extends BaseJwtStrategy {
  constructor(@Inject(JWT_SECRET) @Optional() secret?: string) {
    super(secret || (1000 * Math.random()).toString()); // Random string is to stop errors being thrown
  }
  async validate(payload: any): Promise<any> {
    return true;
  }
}
