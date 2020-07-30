import { Controller } from "@nestjs/common";
import { CrudController, Crud } from "@nestjsx/crud";
import { ApiTags } from "@nestjs/swagger";
import { WeightCategoryEntityService } from "./weight-category-entity.service";

import { api } from "@dt/power-comp/shared";
import { WeightCategoryEntity } from "./weight-category.entity";

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
export class WeightCategoryController
  implements CrudController<WeightCategoryEntity> {
  constructor(public service: WeightCategoryEntityService) {}
}
