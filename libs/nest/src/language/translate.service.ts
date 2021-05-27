import { Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { promises as fs } from "fs";
import { LogInject, LogService } from "../logger";
@Injectable({ scope: Scope.DEFAULT })
export class TranslateService {
  constructor(
    @LogInject("TranslateService") private logger: LogService,
    private config: ConfigService
  ) {}
  async getTranslation(language?: string): Promise<Record<string, string>> {
    const dir = this.config.get("translation.dir");
    const defaultLang = this.config.get("translation.defaultLanguage");
    try {
      const translation = await fs.readFile(
        `${dir}/${language || defaultLang}.json`,
        {
          encoding: "utf-8",
        }
      );
      return JSON.parse(translation);
    } catch (error) {
      this.logger.error(error?.message, error);
      return {};
    }
  }
}
