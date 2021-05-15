import { CompetitionInfoService } from "./competition-info.service";
import { CompetitionInfoController } from "./competition-info.controller";
import { Module } from "@nestjs/common";
import { ApiModule } from "../api.module";
import { DownloadService } from "./download.service";
import { DownloadController } from "./download.controller";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";
import { MulterModule } from "@nestjs/platform-express";

import configuration from "../configuration";
import { join } from "path";

@Module({
  imports: [
    ApiModule,
    MulterModule.register({
      dest: join(configuration().storageLocation, "upload")
    })
  ],
  controllers: [
    CompetitionInfoController,
    DownloadController,
    UploadController
  ],
  providers: [CompetitionInfoService, DownloadService, UploadService],
  exports: []
})
export class CompetitionInfoModule {}
