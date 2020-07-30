import { Controller } from "@nestjs/common";
import { CrudController, Crud } from "@nestjsx/crud";
import { ApiTags } from "@nestjs/swagger";
import { CompetitionEntityService } from "./competition-entity.service";
import { CompetitionEntity } from "./competition.entity";
import { api } from "@dt/power-comp/shared";

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
@Controller(api.competition)
export class CompetitionController
  implements CrudController<CompetitionEntity> {
  constructor(public service: CompetitionEntityService) {}
}
