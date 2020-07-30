import { CompetitionInfoService } from "./competition-info.service";
import { CompetitionInfoController } from "./competition-info.controller";
import { Module } from "@nestjs/common";
import { CoreModule } from "../core";
import { ApiModule } from "../api.module";
import { DownloadService } from "./download.service";
import { DownloadController } from "./download.controller";

@Module({
  imports: [ApiModule],
  controllers: [CompetitionInfoController, DownloadController],
  providers: [CompetitionInfoService, DownloadService],
  exports: []
})
export class CompetitionInfoModule {}
