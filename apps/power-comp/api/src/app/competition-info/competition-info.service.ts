import { Injectable } from "@nestjs/common";
import { LogInject } from "@dt/nest/logger";
import { ILogService, groupByKeys } from "@dt/util";
import { LifterEntityService, LifterEntity } from "@dt/power-comp/entity";
import {
  LiftOrderFunctions,
  getRank,
  classicRankFn,
  protocolOrder,
  classicRankSort
} from "@dt/power-comp/shared";
import { chain } from "lodash";

@Injectable()
export class CompetitionInfoService {
  constructor(
    @LogInject("CompetitionInfoService") private logger: ILogService,
    private lifterService: LifterEntityService
  ) {
    logger.trace("Created");
  }

  async getRanking(competitionId: number, groupId?: number) {
    let filter: any = { competitionId };
    if (groupId) {
      filter = { ...filter, groupId };
    }
    const lifters = await this.lifterService.find({
      where: filter,
      relations: ["group"]
    });
    return getRank<LifterEntity>(lifters, classicRankSort);
  }

  async getLiftOrder(groupId: number) {
    const lifters = await this.lifterService.find({ where: { groupId } });
    return lifters.sort(LiftOrderFunctions.SBD);
  }
}
