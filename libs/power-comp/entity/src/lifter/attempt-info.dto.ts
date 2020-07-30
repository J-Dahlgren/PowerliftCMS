import {
  IAttemptInfo,
  LiftFieldExt,
  LiftFieldExtTuple
} from "@dt/power-comp/shared";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class AttemptInfoDto implements IAttemptInfo {
  @ApiPropertyOptional({ enum: LiftFieldExtTuple })
  liftName!: LiftFieldExt;
  @ApiPropertyOptional()
  attemptNumberOneIndexed!: number;
  @ApiPropertyOptional()
  weight!: number;
}
