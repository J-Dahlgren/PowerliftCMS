import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  AfterLoad
} from "typeorm";
import { IEntity, EnumKeys } from "@pc/util";
import {
  IPlatform,
  ICompetition,
  IWeightClass,
  Gender,
  AgeCategoryEnum,
  ILifter
} from "@pc/power-comp/shared";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CompetitionEntity } from "../competition/competition.entity";

import {
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsArray,
  ValidateNested
} from "class-validator";
import { UPDATE, CREATE } from "@pc/nest/util";
import { EntityBase } from "@pc/nest/entity-service";
import { LifterEntity } from "../lifter/lifter.entity";
import { Type } from "class-transformer";

@Entity()
export class WeightCategoryEntity extends EntityBase implements IWeightClass {
  @Column({ default: true })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @IsBoolean({ groups: [CREATE, UPDATE] })
  @ApiPropertyOptional({ default: true })
  active!: boolean;

  @Column()
  @IsOptional({ groups: [UPDATE] })
  @IsNumber({}, { groups: [CREATE, UPDATE] })
  @ApiProperty()
  minExclusive!: number;

  @Column({ nullable: true })
  @IsOptional({ groups: [UPDATE] })
  @IsNumber({}, { groups: [CREATE, UPDATE] })
  @ApiPropertyOptional()
  maxInclusive?: number;

  @Column("simple-enum", { enum: Gender })
  @IsOptional({ groups: [UPDATE] })
  @IsEnum(Gender, { groups: [CREATE, UPDATE] })
  @ApiProperty({ enum: Gender, required: true })
  gender!: Gender;

  @ApiPropertyOptional({ readOnly: true })
  name?: string;

  @Column()
  @IsOptional({ groups: [UPDATE] })
  @IsNumber({}, { groups: [CREATE, UPDATE] })
  @ApiProperty()
  competitionId!: number;

  @ApiPropertyOptional({ readOnly: true })
  easyName?: string;

  //ageRestriction?: EnumKeys<typeof AgeCategoryEnum>[] | undefined;

  /* Relations */

  @ManyToOne(
    () => CompetitionEntity,
    competition => competition.weightCategories,
    {
      cascade: [],
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    }
  )
  competition!: IEntity<ICompetition>;

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

  @AfterLoad()
  afterLoad() {
    this.name = this.maxInclusive?.toString() || `${this.minExclusive}+`;
    this.easyName = `${this.gender.toUpperCase()}${this.name}`;
  }

  toString() {
    const num = this.maxInclusive || `${this.minExclusive}+`;
    return `${this.gender.toUpperCase()}${num}`;
  }
}
