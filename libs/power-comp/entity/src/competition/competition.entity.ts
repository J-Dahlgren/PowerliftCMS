import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { IEntity } from "@dt/util";
import {
  ICompetition,
  IGroup,
  IPlatform,
  ILifter,
  IWeightClass
} from "@dt/power-comp/shared";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { PlatformEntity } from "../platform/platform.entity";
import { GroupEntity } from "../group";
import { LifterEntity } from "../lifter";
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested
} from "class-validator";
import { CREATE, UPDATE } from "@dt/nest/util";
import { EntityBase } from "@dt/nest/entity-service";
import { WeightCategoryEntity } from "../weight-category";
@Entity()
export class CompetitionEntity extends EntityBase
  implements IEntity<ICompetition> {
  @ApiProperty({ required: true })
  @Column({ nullable: false })
  @IsOptional({ groups: [UPDATE] })
  @IsString({ always: true })
  name!: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  @IsOptional({ always: true })
  @IsString({ always: true })
  city?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  @IsOptional({ groups: [UPDATE, CREATE] })
  @IsString({ always: true })
  location?: string;

  @ApiProperty({ required: false, default: true })
  @Column({ default: true, nullable: false })
  @IsOptional({ always: true })
  @IsBoolean({ always: true })
  active?: boolean;

  /* Relations */

  @Type(() => PlatformEntity)
  @OneToMany(
    () => PlatformEntity,
    platform => platform.competition,
    { cascade: ["insert", "update"] }
  )
  @IsOptional({ always: true })
  @IsArray({ always: true })
  @ValidateNested({ each: true })
  //@ApiProperty({ required: false, type: () => [PlatformEntity] })
  platforms!: IEntity<IPlatform>[];

  @Type(() => GroupEntity)
  @OneToMany(
    () => GroupEntity,
    group => group.competition,
    { cascade: ["insert", "update"] }
  )
  @IsOptional({ always: true })
  @IsArray({ always: true })
  @ValidateNested({ each: true })
  groups!: IEntity<IGroup>[];

  @Type(() => LifterEntity)
  @OneToMany(
    () => LifterEntity,
    lifter => lifter.competition,
    { cascade: ["insert", "update"] }
  )
  @IsOptional({ always: true })
  @IsArray({ always: true })
  @ValidateNested({ each: true })
  lifters!: IEntity<ILifter>[];

  @Type(() => WeightCategoryEntity)
  @OneToMany(
    () => WeightCategoryEntity,
    category => category.competition,
    { cascade: ["insert", "update"] }
  )
  @IsOptional({ always: true })
  @IsArray({ always: true })
  @ValidateNested({ each: true })
  weightCategories!: IEntity<IWeightClass>[];

  toString() {
    return this.name;
  }
}
