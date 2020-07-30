import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { environment } from "../environments/environment";
import { Environment } from "@dt/power-comp/shared";
import configuration from "./configuration";
import { CustomLoggerModule } from "@dt/nest/logger";
import { join } from "path";
import { ApiModule } from "./api.module";
import { SocketModule } from "./socket/socket.module";
import { PlatformManagerModule } from "./competition-manager";
import { LogLevel } from "@dt/util";
import { CompetitionInfoModule } from "./competition-info";
const imports = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: "power-comp.env",
    load: [configuration]
  }),
  TypeOrmModule.forRoot({
    type: "sqlite",
    synchronize: true,
    database: configuration().database.name,
    autoLoadEntities: true
  }),
  CustomLoggerModule.forRoot(LogLevel[configuration().logLevel]),
  ApiModule,
  PlatformManagerModule,
  CompetitionInfoModule,
  SocketModule
];

if (environment.type === Environment.STANDALONE) {
  console.log("STANDALONE BUILD");
  imports.push(
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "client"),
      renderPath: "*",
      exclude: ["/api/(.*)"]
    })
  );
}

@Module({
  imports,
  controllers: [],
  providers: []
})
export class AppModule {}
