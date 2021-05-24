import { Type } from "class-transformer";
import { ValidateNested, IsArray } from "class-validator";
import { Attempt } from "./attempt";
import {
  ILifts,
  LiftField,
  LiftStatus,
  LiftFieldTuple,
  AttemptInfo,
} from "@pc/power-comp/shared";
import { ApiProperty } from "@nestjs/swagger";

export class Lifts implements ILifts {
  constructor(initial: Partial<ILifts> = {}) {
    Object.assign(this, initial);
  }
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attempt)
  @ApiProperty({ type: () => [Attempt] })
  squat: Attempt[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attempt)
  @ApiProperty({ type: () => [Attempt] })
  bench: Attempt[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attempt)
  @ApiProperty({ type: () => [Attempt] })
  deadlift: Attempt[] = [];

  requestedWeight(field: LiftField): Attempt | undefined {
    for (const attempt of this[field]) {
      if (attempt.status === LiftStatus.NOT_ATTEMPTED) {
        return attempt;
      }
    }
  }
  attemptInfo() {
    for (const field of LiftFieldTuple) {
      // Enforce order of keys
      const arr = this[field];
      for (let i = 0; i < arr.length; i++) {
        const attempt = arr[i];
        if (attempt.status === LiftStatus.NOT_ATTEMPTED) {
          return new AttemptInfo({
            weight: attempt.requestedWeight(),
            liftName: field,
            attemptNumberOneIndexed: i + 1,
          });
        }
      }
    }
    return new AttemptInfo();
  }
}
