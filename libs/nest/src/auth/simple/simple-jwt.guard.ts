import { ExecutionContext, Inject, Injectable, Optional } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { SIMPLE_AUTH_PASSWORD_TOKEN } from "./tokens";

@Injectable()
export class SimpleJwtGuard extends AuthGuard("jwt") {
  constructor(
    @Inject(SIMPLE_AUTH_PASSWORD_TOKEN) @Optional() private password?: string
  ) {
    super();
  }
  canActivate(context: ExecutionContext) {
    return !!this.password ? super.canActivate(context) : true;
  }
}
