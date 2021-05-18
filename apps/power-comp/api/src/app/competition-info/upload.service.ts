import { Injectable } from "@nestjs/common";
import { LogInject } from "@pc/nest/logger";
import { ILogService, extractKeys } from "@pc/util";
import {
  GroupEntity,
  GroupEntityService,
  LifterEntity,
  LifterEntityService,
  Lifts
} from "@pc/power-comp/entity";
import { environment } from "../../environments/environment";
import {
  Environment,
  competitionModes,
  Gender,
  defaultLifts,
  LiftField
} from "@pc/power-comp/shared";
import { CellValue, Row, Workbook } from "exceljs";
import { cloneDeep } from "lodash";

const assetsFolder =
  environment.type === Environment.STANDALONE
    ? "."
    : "dist/apps/power-comp/api/assets";

@Injectable()
export class UploadService {
  constructor(
    @LogInject("UploadService") private logger: ILogService,
    private groupService: GroupEntityService,
    private lifterService: LifterEntityService
  ) {
    logger.trace("Created");
  }
  async parseRegistration(workBook: Workbook, competitionId: number) {
    const groups = await this.groupService.repo.find({
      where: { competitionId }
    });
    const sheet = workBook.worksheets[0];
    const baseRowNumber = 3;
    const lifters: LifterEntity[] = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber >= baseRowNumber) {
        const lifter = this.parseRow(row, groups);
        if (lifter) {
          const values = row.values as CellValue[];
          lifter.competitionId = competitionId;
          lifter.groupId = groups.find(g => g.name === values[14] + "")?.id;
          lifters.push(lifter);
        }
      }
    });
    for (const lifter of lifters) {
      try {
        await this.lifterService.repo.save(lifter);
      } catch (error) {
        this.logger.error(`Failed to insert: ${error.message}`, lifter);
      }
    }
  }
  private parseRow(row: Row, groups: GroupEntity[]): LifterEntity | null {
    /*
    A1  - Lot
    B2  - License    
    C3  - Lastname
    D4  - Firstname
    E5  - Gender    
    F6  - BW
    G7  - Team
    H8  - Birth Year
    I9  - Mode
    J10 - Eq        
    K11 - Squat
    L12 - BP
    M13 - DL
    N14 - Group
    */
    const values = row.values as CellValue[];

    const firstname = values[4];
    const lastname = values[3];
    if (!lastname || !firstname) return null;

    const lifter = this.lifterService.repo.create();
    lifter.lot = +(values[1] || 0);
    lifter.license = values[2] + "";
    lifter.firstname = firstname + "";
    lifter.lastname = lastname + "";
    lifter.gender = (values[5] as Gender) || "m";
    lifter.bodyWeight = +(values[6] || 0) || undefined;
    lifter.team = values[7] + "";
    lifter.settings = { squat: {}, bench: {} };
    lifter.bornYear = +(values[8] || 0) || undefined;
    lifter.equipped = !!values[10];

    const squat = +(values[11] || 0);
    const bench = +(values[12] || 0);
    const deadlift = +(values[13] || 0);
    const lifts: { [key in LiftField]: number } = { squat, bench, deadlift };
    const mode =
      competitionModes.find(m => m === (values[9] + "").toUpperCase()) || "SBD";

    lifter.lifts = new Lifts(cloneDeep(defaultLifts[mode]));
    for (const key of extractKeys(lifts)) {
      if (lifter.lifts[key].length) {
        lifter.lifts[key][0].requested = lifts[key];
      }
    }
    return lifter;
  }
}
