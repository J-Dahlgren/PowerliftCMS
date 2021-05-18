import { Controller, UseGuards } from "@nestjs/common";
import { CrudController, Crud } from "@nestjsx/crud";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CompetitionEntityService } from "./competition-entity.service";
import { CompetitionEntity } from "./competition.entity";
import { api } from "@pc/power-comp/shared";
import { SimpleJwtGuard } from "@pc/nest/auth";
@Crud({
  model: {
    type: CompetitionEntity
  },
  query: {
    join: {
      platforms: {},
      groups: {},
      lifters: {}
    }
  }
})
@ApiTags(api.competition.toUpperCase())
@ApiBearerAuth()
@Controller(api.competition)
@UseGuards(SimpleJwtGuard)
export class CompetitionController
  implements CrudController<CompetitionEntity> {
  constructor(public service: CompetitionEntityService) {}
}
