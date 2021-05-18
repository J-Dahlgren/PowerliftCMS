import {
  IBenchPressSettings,
  ILifterSettings,
  ISquatSettings,
  SquatRackSettingsEnum
} from "@pc/power-comp/shared";
import {
  IsNumber,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsEnum
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ExtractEnumKeys } from "@pc/util";
import { Type } from "class-transformer";

export class LifterSettings implements ILifterSettings {
  @ValidateNested()
  @Type(() => SquatSettings)
  @ApiProperty({ type: () => SquatSettings })
  squat!: ISquatSettings;
  @ValidateNested()
  @Type(() => BenchSettings)
  @ApiProperty({ type: () => BenchSettings })
  bench!: IBenchPressSettings;
}

export class BenchSettings implements IBenchPressSettings {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  rackHeight?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  safetyRackHeight?: number;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  liftOffAssistance?: boolean;
}

export class SquatSettings implements ISquatSettings {
  @IsOptional()
  @IsEnum(ExtractEnumKeys(SquatRackSettingsEnum))
  @ApiPropertyOptional({ enum: ExtractEnumKeys(SquatRackSettingsEnum) })
  rackTilt?: keyof typeof SquatRackSettingsEnum;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  rackHeight?: number;
}
