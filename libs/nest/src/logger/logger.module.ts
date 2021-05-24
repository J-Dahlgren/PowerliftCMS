import { Logger, Module, Scope } from "@nestjs/common";
const provider = {
  provide: Logger,
  useClass: Logger,
  scope: Scope.TRANSIENT,
};
@Module({
  providers: [provider],
  exports: [Logger],
})
export class LoggerModule {}
