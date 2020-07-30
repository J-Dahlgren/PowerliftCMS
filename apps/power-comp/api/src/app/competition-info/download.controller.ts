import { Controller, Get, Param, Header, Res } from "@nestjs/common";
import { api } from "@dt/power-comp/shared";
import { ApiTags } from "@nestjs/swagger";
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
  async groupProtocol(
    @Param("groupId") groupId: number,
    @Res() response: Response
  ) {
    const buffer = await this.downloadService.generateGroupProtocol(groupId);
    response.send(buffer);
    response.end();
  }
}
