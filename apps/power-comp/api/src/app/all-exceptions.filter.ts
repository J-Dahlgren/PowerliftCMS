import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  HttpServer,
  Injectable
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { LogService } from "@dt/nest/logger";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(
    private logService: LogService,
    applicationRef?: HttpServer<any, any> | undefined
  ) {
    super(applicationRef);
  }
  catch(exception: any, host: ArgumentsHost) {
    if (!(exception instanceof HttpException)) {
      this.logService.error(exception?.message || exception, exception);
    } else {
      this.logService.warn(
        `${exception.toString()}`,
        JSON.stringify(exception.getResponse(), null, 2)
      );
    }
    super.catch(exception, host);
  }
}
