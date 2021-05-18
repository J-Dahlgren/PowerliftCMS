import { Controller, UseGuards } from "@nestjs/common";
import { CrudController, Crud } from "@nestjsx/crud";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PlatformEntityService } from "./platform-entity.service";
import { PlatformEntity } from "./platform.entity";
import { api } from "@pc/power-comp/shared";
import { SimpleJwtGuard } from "@pc/nest/auth";

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
@ApiBearerAuth()
@UseGuards(SimpleJwtGuard)
export class PlatformController implements CrudController<PlatformEntity> {
  constructor(public service: PlatformEntityService) {}
}
