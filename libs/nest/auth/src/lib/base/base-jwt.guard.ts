import { AuthGuard } from "@nestjs/passport";

export abstract class BaseJwtGuard extends AuthGuard("jwt") {}
