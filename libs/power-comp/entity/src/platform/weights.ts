import { IsNumber, Min, ValidateNested, IsArray } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IPlatformWeights, IWeightPlate } from "@dt/power-comp/shared";
export class PlatformWeights implements IPlatformWeights {
  @IsNumber({ allowInfinity: false, allowNaN: false }, { always: true })
  @Min(0, { always: true })
  @ApiProperty()
  collarWeight!: number;

  @IsNumber({ allowInfinity: false, allowNaN: false }, { always: true })
  @Min(0, { always: true })
  @ApiProperty()
  barWeight!: number;

  @IsArray({ always: true })
  @ValidateNested({ each: true, always: true })
  @Type(() => WeightPlate)
  @ApiProperty({ type: () => [WeightPlate] })
  plates!: WeightPlate[];
}
export class WeightPlate implements IWeightPlate {
  @IsNumber({ allowInfinity: false, allowNaN: false }, { always: true })
  @Min(0, { always: true })
  @ApiProperty()
  weight!: number;

  @IsNumber({ allowInfinity: false, allowNaN: false }, { always: true })
  @Min(0, { always: true })
  @ApiProperty()
  quantity!: number;
}
