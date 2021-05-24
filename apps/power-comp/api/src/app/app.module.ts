import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { environment } from "../environments/environment";
import { Environment } from "@pc/power-comp/shared";
import configuration from "./configuration";
import { CustomLoggerModule } from "@pc/nest/logger";
import { join } from "path";
import { ApiModule } from "./api.module";
import { SocketModule } from "./socket/socket.module";
import { PlatformManagerModule } from "./competition-manager";
import { LogLevel } from "@pc/util";
import { CompetitionInfoModule } from "./competition-info";
import { SimpleAuthModule } from "@pc/nest/auth";

const imports = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: "power-comp.env",
    load: [configuration],
  }),
  TypeOrmModule.forRoot({
    type: "sqlite",
    autoLoadEntities: true,
    database: configuration().database.name,
    synchronize: configuration().database.synchronize,
    migrationsRun: configuration().database.runMigrations,
    migrations: environment.migrations,
  }),
  CustomLoggerModule.forRoot(LogLevel[configuration().logLevel]),
  SimpleAuthModule.forRoot(configuration().auth),
  PlatformManagerModule,
  CompetitionInfoModule,
  ApiModule,
  SocketModule,
];

if (
  environment.type === Environment.STANDALONE ||
  environment.type === Environment.CLOUD
) {
  const path =
    environment.type === Environment.STANDALONE
      ? "client"
      : "dist/apps/power-comp/ui";
  imports.push(
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), path),
      renderPath: "*",
      exclude: ["/api/(.*)"],
    })
  );
}

@Module({
  imports,
  controllers: [],
  providers: [],
})
export class AppModule {}
