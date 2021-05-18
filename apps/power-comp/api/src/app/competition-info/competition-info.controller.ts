import { Controller, Get, Param } from "@nestjs/common";
import { api } from "@pc/power-comp/shared";
import { LifterEntityService, LifterEntity } from "@pc/power-comp/entity";
import { ApiTags, ApiResponse, ApiParam } from "@nestjs/swagger";
import { CompetitionInfoService } from "./competition-info.service";
import { RankingDto } from "./ranking.dto";

@ApiTags(api.competitionInfo.root.toUpperCase())
@Controller(api.competitionInfo.root)
export class CompetitionInfoController {
  constructor(private competitionInfoService: CompetitionInfoService) {}

  @ApiResponse({
    description:
      "Returns lifters in competition (and group if specified) in protocol order with calculated ranking.",
    type: RankingDto,
    isArray: true,
    status: 200
  })
  @ApiParam({ name: "groupId", required: false })
  @ApiParam({ name: "competitionId", required: true })
  @Get(`${api.competitionInfo.result}/:competitionId/:groupId?`)
  result(
    @Param("competitionId") competitionId: number,
    @Param("groupId") groupId?: number
  ) {
    return this.competitionInfoService.getRanking(competitionId, groupId);
  }

  @ApiResponse({
    type: () => LifterEntity,
    isArray: true,
    status: 200,
    description: "Returns lifters sorted from first in order at index 0 to last"
  })
  @Get(`${api.competitionInfo.liftOrder}/:groupId`)
  liftOrder(@Param("groupId") groupId: number) {
    return this.competitionInfoService.getLiftOrder(groupId);
  }
}
