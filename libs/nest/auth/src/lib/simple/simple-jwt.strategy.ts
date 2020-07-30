import { BaseJwtStrategy } from "../base";
import { Inject } from "@nestjs/common";
import { JWT_SECRET } from "../di-tokens";

export class SimpleJwtStrategy extends BaseJwtStrategy {
  constructor(@Inject(JWT_SECRET) secret: string) {
    super(secret);
  }
  async validate(payload: any): Promise<any> {
    return true;
  }
}
