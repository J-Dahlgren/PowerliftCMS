import { IAttempt, LiftStatus } from "@pc/power-comp/shared";
import { IsEnum, IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class Attempt implements IAttempt {
  constructor(initial: Partial<IAttempt> = {}) {
    Object.assign(this, initial);
  }
  @IsEnum(LiftStatus)
  @ApiProperty({
    enum: LiftStatus,
    default: LiftStatus[LiftStatus.NOT_ATTEMPTED]
  })
  @Transform((status: LiftStatus) =>
    typeof status === "string" ? LiftStatus[status] : status
  )
  status: LiftStatus = LiftStatus.NOT_ATTEMPTED;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  automatic?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  requested?: number;

  requestedWeight() {
    return this.requested || this.automatic;
  }
}
