import { LifterEntity } from "@pc/power-comp/entity";
import { IRank } from "@pc/power-comp/shared";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class RankingDto extends LifterEntity implements IRank {
  @ApiPropertyOptional()
  rank!: number;
}
