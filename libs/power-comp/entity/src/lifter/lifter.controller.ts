import { Controller, Module, Scope, Body, Post, Param } from "@nestjs/common";
import { CrudController, Crud } from "@nestjsx/crud";
import { ApiTags, ApiBody, ApiParam } from "@nestjs/swagger";
import { LifterEntityService } from "./lifter-entity.service";
import { LifterEntity } from "./lifter.entity";
import { api } from "@dt/power-comp/shared";

@Crud({
  model: {
    type: LifterEntity
  },
  query: {
    join: {
      competition: {},
      group: {},
      weightCategory: { eager: true }
    }
  }
})
@ApiTags(api.lifter.root.toUpperCase())
@Controller(api.lifter.root)
export class LifterController implements CrudController<LifterEntity> {
  constructor(public service: LifterEntityService) {}
  @ApiParam({ name: "competitionId", type: Number })
  @Post(`${api.lifter.drawLot}/:competitionId`)
  drawLot(@Param("competitionId") id: string | number) {
    return this.service.drawLot(+id);
  }
}
