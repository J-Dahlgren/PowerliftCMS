import { Controller, Get, Param, Header, Res, Query } from "@nestjs/common";
import { api } from "@pc/power-comp/shared";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { DownloadService } from "./download.service";
import { Response } from "express";
@ApiTags(api.download.root.toUpperCase())
@Controller(api.download.root)
export class DownloadController {
  constructor(private downloadService: DownloadService) {}

  @Get(`${api.download.protocol}/:groupId`)
  @Header("Content-Disposition", `attachment; filename=test.xlsx`)
  @Header(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
  @ApiParam({ name: "language", required: false })
  async groupProtocol(
    @Param("groupId") groupId: number,
    @Res() response: Response,
    @Query("language") language?: string
  ) {
    const buffer = await this.downloadService.generateGroupProtocol(
      groupId,
      language
    );
    response.send(buffer);
    response.end();
  }

  @Get(`${api.download.registration}`)
  @Header(
    "Content-Disposition",
    `attachment; filename=RegistrationTemplate_en.xlsx`
  )
  @Header(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
  @ApiParam({ name: "language", required: false })
  async registrationTemplate(
    @Res() response: Response,
    @Query("language") language?: string
  ) {
    const buffer = await this.downloadService.getRegistrationTemplate(language);
    response.send(buffer);
    response.end();
  }
}
