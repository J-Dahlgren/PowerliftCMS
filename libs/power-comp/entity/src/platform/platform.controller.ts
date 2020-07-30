import { Controller } from "@nestjs/common";
import { CrudController, Crud } from "@nestjsx/crud";
import { ApiTags } from "@nestjs/swagger";
import { PlatformEntityService } from "./platform-entity.service";
import { PlatformEntity } from "./platform.entity";
import { api } from "@dt/power-comp/shared";

@Crud({
  model: {
    type: PlatformEntity
  },
  query: {
    join: {
      competition: {},
      groups: {}
    }
  }
})
@ApiTags(api.platform.toUpperCase())
@Controller(api.platform)
export class PlatformController implements CrudController<PlatformEntity> {
  constructor(public service: PlatformEntityService) {}
}
