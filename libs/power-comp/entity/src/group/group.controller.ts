import { Controller } from "@nestjs/common";
import { CrudController, Crud } from "@nestjsx/crud";
import { ApiTags } from "@nestjs/swagger";
import { GroupEntityService } from "./group-entity.service";
import { GroupEntity } from "./group.entity";
import { api } from "@dt/power-comp/shared";

@Crud({
  model: {
    type: GroupEntity
  },
  query: {
    join: {
      competition: {},
      platform: {},
      lifters: {}
    }
  }
})
@ApiTags(api.group.toUpperCase())
@Controller(api.group)
export class GroupController implements CrudController<GroupEntity> {
  constructor(public service: GroupEntityService) {}
}
