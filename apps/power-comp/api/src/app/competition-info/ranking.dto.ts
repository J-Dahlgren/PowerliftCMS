import { LifterEntity } from "@dt/power-comp/entity";
import { IRank } from "@dt/power-comp/shared";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class RankingDto extends LifterEntity implements IRank {
  @ApiPropertyOptional()
  rank!: number;
}
