import { Entity, Column, ManyToOne, AfterLoad } from "typeorm";
import { IEntity } from "@pc/util";
import {
  ILifter,
  Gender,
  ICompetition,
  IGroup,
  attemptInfo,
  getResult,
  LifterData,
  AgeCategoryName,
  getAgeCategory,
  AgeCategories,
  IWeightClass,
  ILifterSettings,
  CompetitionModeName,
  competitionModes,
  matchesAnyLiftConfig,
  ipfScoreFormula
} from "@pc/power-comp/shared";
import {
  IsNumber,
  ValidateNested,
  IsOptional,
  IsString,
  IsEnum,
  Min,
  IsBoolean
} from "class-validator";
import { ApiProperty, ApiProduces, ApiPropertyOptional } from "@nestjs/swagger";

import { Type } from "class-transformer";
import { Lifts } from "./lift";
import { CompetitionEntity } from "../competition/competition.entity";
import { GroupEntity } from "../group/group.entity";
import { CREATE, UPDATE } from "@pc/nest/util";
import { EntityBase } from "@pc/nest/entity-service";
import { AttemptInfoDto } from "./attempt-info.dto";
import { ResultDto } from "./result.dto";
import { WeightCategoryEntity } from "../weight-category";
import { LifterSettings } from "./lifter-settings";
@Entity()
export class LifterEntity extends EntityBase implements LifterData {
  constructor(initial: Partial<IEntity<ILifter>> = {}) {
    super();
    Object.assign(this, initial);
  }

  @Column()
  @IsOptional({ groups: [UPDATE] })
  @IsNumber({}, { groups: [CREATE, UPDATE] })
  @ApiProperty()
  lot!: number;

  @ApiPropertyOptional({ readOnly: true })
  fullname!: string;

  @Column()
  @IsOptional({ groups: [UPDATE] })
  @IsNumber({}, { groups: [CREATE, UPDATE] })
  @ApiProperty()
  competitionId!: number;

  @Column({ nullable: true })
  @IsOptional({ always: true })
  @IsNumber({}, { groups: [CREATE, UPDATE] })
  @ApiPropertyOptional()
  groupId?: number;

  @Column("simple-json")
  @IsOptional({ groups: [UPDATE] })
  @ValidateNested({ groups: [CREATE, UPDATE] })
  @Type(() => Lifts)
  @ApiProperty({ type: Lifts })
  lifts!: Lifts;

  @Column({ nullable: true })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @IsString({ groups: [CREATE, UPDATE] })
  @ApiPropertyOptional()
  license?: string;

  @Column()
  @IsOptional({ groups: [UPDATE] })
  @IsString({ groups: [CREATE, UPDATE] })
  @ApiProperty()
  firstname!: string;

  @Column()
  @IsOptional({ groups: [UPDATE] })
  @IsString({ groups: [CREATE, UPDATE] })
  @ApiProperty({ required: true })
  lastname!: string;

  @Column("simple-enum", { enum: Gender })
  @IsOptional({ groups: [UPDATE] })
  @IsEnum(Gender, { groups: [CREATE, UPDATE] })
  @ApiProperty({ enum: Gender, required: true })
  gender!: Gender;

  @Column({ nullable: true })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @IsNumber({}, { groups: [CREATE, UPDATE] })
  @Min(1900, { groups: [CREATE, UPDATE] })
  @ApiPropertyOptional({ minimum: 1900 })
  bornYear?: number;

  @Column({ nullable: true })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { groups: [CREATE, UPDATE] }
  )
  @Min(0, { groups: [CREATE, UPDATE] })
  @ApiPropertyOptional({ minimum: 0 })
  bodyWeight?: number;

  @Column({ nullable: false, default: false })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @IsBoolean({ groups: [CREATE, UPDATE] })
  @ApiPropertyOptional({ default: false })
  equipped?: boolean;

  @Column({ nullable: true })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @IsString({ groups: [CREATE, UPDATE] })
  @ApiPropertyOptional()
  team?: string;

  @ApiPropertyOptional({ readOnly: true })
  attemptInfo!: AttemptInfoDto;

  @ApiPropertyOptional({ readOnly: true })
  result!: ResultDto;

  @ApiPropertyOptional({ readOnly: true, enum: AgeCategories })
  ageCategory?: AgeCategoryName;

  @ApiPropertyOptional({ readOnly: true, enum: competitionModes })
  competitionMode?: CompetitionModeName;

  @ApiPropertyOptional({ readOnly: true })
  score?: number;

  @Column("simple-json")
  @IsOptional({ groups: [CREATE, UPDATE] })
  @ValidateNested({ groups: [CREATE, UPDATE] })
  @Type(() => LifterSettings)
  @ApiPropertyOptional({ type: () => LifterSettings })
  settings!: ILifterSettings;

  /* Relations */

  @ManyToOne(
    () => CompetitionEntity,
    competition => competition.lifters
  )
  competition!: IEntity<ICompetition>;

  @ManyToOne(
    () => GroupEntity,
    group => group.lifters,
    {
      cascade: [],
      onDelete: "SET NULL",
      onUpdate: "NO ACTION"
    }
  )
  group?: IEntity<IGroup>;

  @ManyToOne(
    () => WeightCategoryEntity,
    category => category.lifters,
    {
      eager: true,
      cascade: [],
      onDelete: "SET NULL",
      onUpdate: "NO ACTION"
    }
  )
  @ApiPropertyOptional({ type: WeightCategoryEntity, readOnly: true })
  weightCategory?: IWeightClass | null;

  @AfterLoad()
  afterLoad() {
    this.attemptInfo = attemptInfo(this.lifts);
    this.result = getResult(this);
    this.fullname = `${this.firstname} ${this.lastname}`;
    this.ageCategory = getAgeCategory(this)?.name;
    this.competitionMode = matchesAnyLiftConfig(this.lifts) || undefined;
    this.score = ipfScoreFormula(this) || undefined;
  }
  toString() {
    return `${this.firstname}_${this.lastname}`;
  }
}
