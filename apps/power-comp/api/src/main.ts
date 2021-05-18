import { NestFactory, HttpAdapterHost } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";
import { LogService } from "@pc/nest/logger";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AllExceptionsFilter } from "./app/all-exceptions.filter";
import { ValidationPipe, INestApplication } from "@nestjs/common";
import configuration from "./app/configuration";
import { Environment } from "@pc/power-comp/shared";
import { IoAdapter } from "@nestjs/platform-socket.io";
import {
  CompetitionEntityService,
  LifterEntityService
} from "@pc/power-comp/entity";
import { competitionDefaults } from "./defaults";
import { writeFileSync } from "fs";
import { sleep } from "@pc/util";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn"]
  });
  const config = configuration();
  app.setGlobalPrefix("api");

  const { httpAdapter } = app.get(HttpAdapterHost);
  const bootLogger = await app.resolve(LogService);
  bootLogger.setContext("bootstrap");
  const exceptionLogger = await app.resolve(LogService);
  exceptionLogger.setContext("ExceptionsHandler");

  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalFilters(new AllExceptionsFilter(exceptionLogger, httpAdapter));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useWebSocketAdapter(new IoAdapter(app));

  const port = config.port;
  const options = new DocumentBuilder()
    .setTitle("Power Comp")
    .addServer(`/${globalPrefix}`) // This allow hiding of the global prefix in all paths
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, options, {
    ignoreGlobalPrefix: true
  });
  if (environment.type === Environment.STANDALONE) {
    writeFileSync("client/swagger-spec.json", JSON.stringify(swaggerDocument));
  } else {
    SwaggerModule.setup("docs", app, swaggerDocument);
  }

  if (configuration().database.name === ":memory:") {
    await prepopulate(app);
  }

  await app.listen(port, () => {
    if (environment.type === Environment.STANDALONE) {
      bootLogger.info(`Application available at http://localhost:${port}`);
    } else {
      bootLogger.info(
        `API listening at http://localhost:${port}/${globalPrefix}`
      );
      bootLogger.info(`Database file path: ${config.database.name}`);
    }
    bootLogger.info("Configuration:", configuration());
  });
}

bootstrap();

async function prepopulate(app: INestApplication) {
  const prePopLogger = await app.resolve(LogService);
  prePopLogger.setContext("Database_Prepopulator");
  prePopLogger.warn("Starting...");
  const comp = await app.resolve(CompetitionEntityService);
  const c = comp.repo.create(competitionDefaults);

  await comp.repo.save(c);
  prePopLogger.warn("Done");

  const lifter = await app.resolve(LifterEntityService);
  await sleep(1000);
  prePopLogger.warn("Drawing lots...");
  await lifter.drawLot(1);
  prePopLogger.warn("Done");
}
