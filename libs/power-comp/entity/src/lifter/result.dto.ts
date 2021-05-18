import { Result } from "@pc/power-comp/shared";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ResultDto implements Result {
  @ApiPropertyOptional()
  total!: number;
  @ApiPropertyOptional()
  squat!: number;
  @ApiPropertyOptional()
  bench!: number;
  @ApiPropertyOptional()
  deadlift!: number;
}
