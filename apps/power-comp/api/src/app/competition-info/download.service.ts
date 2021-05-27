import { Injectable } from "@nestjs/common";
import { LogInject } from "@pc/nest/logger";
import { ILogService, extractKeys } from "@pc/util";
import { GroupEntityService } from "@pc/power-comp/entity";
import { environment } from "../../environments/environment";
import {
  Environment,
  LiftStatus,
  getRank,
  classicRankSort,
} from "@pc/power-comp/shared";
import { promisify } from "util";
import { readFile, writeFile } from "fs";
import XlsxTemplate from "xlsx-template";
import moment from "moment";
import { TranslateService } from "@pc/nest";

const readFileAsync = promisify(readFile);

const assetsFolder =
  environment.type === Environment.STANDALONE
    ? "."
    : "dist/apps/power-comp/api/assets";

@Injectable()
export class DownloadService {
  constructor(
    @LogInject("DownloadService") private logger: ILogService,
    private groupService: GroupEntityService,
    private translate: TranslateService
  ) {
    logger.trace("Created");
    logger.debug(`Assets folder: ${assetsFolder}`);
  }
  async generateGroupProtocol(groupId: number, language?: string) {
    const file = await readFileAsync(
      `${assetsFolder}/templates/ProtocolSheetTemplate_en.xlsx`
    );
    const translations = await this.translate.getTranslation(language);
    const template = new XlsxTemplate(file);
    const group = await this.groupService.findOne(groupId, {
      relations: ["competition", "lifters"],
    });
    if (!group) {
      throw new Error(`No group with id ${groupId} exists`);
    }

    const lifters = getRank(group.lifters, classicRankSort).map((l) => {
      const result = {
        ...l,
      } as any;
      for (const field of extractKeys(l.lifts)) {
        result[field] = {
          best: l.result[field] || undefined,
        };

        l.lifts[field].forEach((attempt, index) => {
          const weight = attempt.requested || attempt.automatic;
          let strWeight: number | undefined;
          if (attempt.status === LiftStatus.SUCCESSFUL) {
            strWeight = attempt.requested || attempt.automatic;
          } else if (attempt.status === LiftStatus.FAILED && weight) {
            strWeight = -weight;
          }
          result[field][index + 1] = strWeight;
        });
      }
      const mode = `${l.competitionMode || "SBD"}${l.equipped ? "-E" : ""}`;
      result.competitionMode = translations[`competition-mode.${mode}`];
      if (result.result) {
        result.result.total = l.result.total || undefined;
      }

      return result;
    });
    const values = {
      lifters,
      competition: group?.competition,
      group: {
        ...group,
        competitionTime: group.competitionTime
          ? moment(group.competitionTime).format("YYYY-MM-DD hh:mm")
          : undefined,
      },
      t: translations,
    } as { [key: string]: any };

    template.substitute(1, values);
    const buffer = template.generate({ type: "nodebuffer" });
    return buffer;
  }
  async getRegistrationTemplate() {
    return readFileAsync(
      `${assetsFolder}/templates/RegistrationTemplate_en.xlsx`
    );
  }
}
