import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class SimpleLoginDTO {
  @IsString()
  @ApiProperty()
  password!: string;
}
