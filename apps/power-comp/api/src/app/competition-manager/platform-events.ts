import { IPlatformEvent, JudgeDecision } from "@dt/power-comp/shared";
import {
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  IsBoolean
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Clock, TimerState, ExtractEnumKeys, EnumKeys } from "@dt/util";
import { Type, Transform } from "class-transformer";

export abstract class PlatformEventDto {
  @ApiProperty({ required: true })
  @IsNumber()
  room!: number;
}

export class ActiveGroupDto extends PlatformEventDto
  implements IPlatformEvent<"activeGroupId"> {
  @ApiProperty({ required: false, type: () => Number })
  @IsOptional()
  @IsNumber()
  data: number | undefined;
}

export class JudgeDecisionDto extends PlatformEventDto
  implements IPlatformEvent<"decision"> {
  @ApiProperty({
    type: () => Decision,
    required: true
  })
  @ValidateNested()
  @Type(() => Decision)
  data!: {
    judgeNumber: number;
    d: keyof typeof JudgeDecision;
  };
}
export class Decision {
  @IsEnum(ExtractEnumKeys(JudgeDecision))
  @ApiProperty({
    enum: ExtractEnumKeys(JudgeDecision),
    required: true
  })
  d!: keyof typeof JudgeDecision;

  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  judgeNumber!: number;
}
export class ClockDto implements Clock {
  @ApiProperty({ required: true, enum: ExtractEnumKeys(TimerState) })
  @IsEnum(ExtractEnumKeys(TimerState))
  state: "OFF" | "ON" = "OFF";

  @ApiProperty({ minimum: 0, type: () => Number, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  remainingMillis?: number;
}
export class LiftTimerDto extends PlatformEventDto
  implements IPlatformEvent<"liftTimer"> {
  @ApiProperty({ type: () => ClockDto, required: true })
  @Type(() => ClockDto)
  @ValidateNested()
  data!: ClockDto;
}

export class SecretariatDecisionDto extends PlatformEventDto
  implements IPlatformEvent<"secretariatDecision"> {
  @ApiProperty({ required: true })
  @IsBoolean()
  data!: boolean;
}

export type PlatformEvents = ActiveGroupDto | JudgeDecisionDto | LiftTimerDto;
