import { Controller, UseGuards } from "@nestjs/common";
import { CrudController, Crud } from "@nestjsx/crud";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { WeightCategoryEntityService } from "./weight-category-entity.service";
import { api } from "@dt/power-comp/shared";
import { WeightCategoryEntity } from "./weight-category.entity";
import { SimpleJwtGuard } from "@dt/nest/auth";

@Crud({
  model: {
    type: WeightCategoryEntity
  },
  query: {
    join: {
      competition: {},
      lifters: {}
    }
  }
})
@ApiTags(api.weightCategory.toUpperCase())
@Controller(api.weightCategory)
@ApiBearerAuth()
@UseGuards(SimpleJwtGuard)
export class WeightCategoryController
  implements CrudController<WeightCategoryEntity> {
  constructor(public service: WeightCategoryEntityService) {}
}
