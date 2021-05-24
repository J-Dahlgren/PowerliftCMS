import { Controller, Post, Param, UseGuards } from "@nestjs/common";
import { CrudController, Crud } from "@nestjsx/crud";
import { ApiTags, ApiParam, ApiBearerAuth } from "@nestjs/swagger";
import { LifterEntityService } from "./lifter-entity.service";
import { LifterEntity } from "./lifter.entity";
import { api } from "@pc/power-comp/shared";
import { SimpleJwtGuard } from "@pc/nest/auth";

@Crud({
  model: {
    type: LifterEntity,
  },
  query: {
    join: {
      competition: {},
      group: {},
      weightCategory: { eager: true },
    },
  },
})
@ApiTags(api.lifter.root.toUpperCase())
@ApiBearerAuth()
@Controller(api.lifter.root)
@UseGuards(SimpleJwtGuard)
export class LifterController implements CrudController<LifterEntity> {
  constructor(public service: LifterEntityService) {}
  @ApiParam({ name: "competitionId", type: Number })
  @Post(`${api.lifter.drawLot}/:competitionId`)
  drawLot(@Param("competitionId") id: string | number) {
    return this.service.drawLot(+id);
  }
}
