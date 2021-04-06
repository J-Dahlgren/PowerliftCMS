import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  Param
} from "@nestjs/common";
import { api } from "@dt/power-comp/shared";
import { ApiConsumes, ApiHeader, ApiTags } from "@nestjs/swagger";
import { UploadService } from "./upload.service";
import { Multer } from "multer";
import { Express } from "express";
import { FileInterceptor, MulterModule } from "@nestjs/platform-express";
import { Workbook } from "exceljs";
import { unlink } from "fs";

@ApiTags(api.upload.root.toUpperCase())
@Controller(api.upload.root)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post(`${api.upload.registration}/:competitionId`)
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  async registration(
    @UploadedFile() file: Express.Multer.File,
    @Param("competitionId") competitionId: number
  ) {
    if (!file) throw new HttpException("No file provided", 400);
    try {
      console.log(file);
      const wb = await new Workbook().xlsx.readFile(file.path);
      this.uploadService.parseRegistration(wb, competitionId);
      unlink(file.path, () => {});
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}