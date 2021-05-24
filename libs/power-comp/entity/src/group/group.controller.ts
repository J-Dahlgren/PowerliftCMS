import { Controller, UseGuards } from "@nestjs/common";
import { CrudController, Crud } from "@nestjsx/crud";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GroupEntityService } from "./group-entity.service";
import { GroupEntity } from "./group.entity";
import { api } from "@pc/power-comp/shared";
import { SimpleJwtGuard } from "@pc/nest/auth";

@Crud({
  model: {
    type: GroupEntity,
  },
  query: {
    join: {
      competition: {},
      platform: {},
      lifters: {},
    },
  },
})
@ApiTags(api.group.toUpperCase())
@Controller(api.group)
@ApiBearerAuth()
@UseGuards(SimpleJwtGuard)
export class GroupController implements CrudController<GroupEntity> {
  constructor(public service: GroupEntityService) {}
}
