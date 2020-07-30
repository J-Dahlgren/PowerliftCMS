import { BaseJwtGuard } from "../base";
import { Injectable, Logger } from "@nestjs/common";
@Injectable()
export class SimpleJwtGuard extends BaseJwtGuard {
  constructor() {
    super();
  }
}
