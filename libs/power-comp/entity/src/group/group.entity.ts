import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { IEntity } from "@pc/util";
import {
  IGroup,
  ILifter,
  IPlatform,
  ICompetition,
  LifterData,
} from "@pc/power-comp/shared";
import { ApiProperty } from "@nestjs/swagger";
import { LifterEntity } from "../lifter";
import { Type } from "class-transformer";
import { CompetitionEntity } from "../competition/competition.entity";
import { PlatformEntity } from "../platform/platform.entity";
import { IsOptional, IsNumber, IsDateString, IsString } from "class-validator";
import { UPDATE, CREATE } from "@pc/nest/util";
import { EntityBase } from "@pc/nest/entity-service";

@Entity()
export class GroupEntity extends EntityBase implements IEntity<IGroup> {
  @Column()
  @IsOptional({ groups: [UPDATE] })
  @IsString({ groups: [CREATE, UPDATE] })
  @ApiProperty({ required: true })
  name!: string;

  @Column({ nullable: true })
  @IsOptional({ always: true })
  @IsDateString({ always: true })
  @ApiProperty({ required: false, type: Date })
  weighInTime?: Date;

  @Column({ nullable: true })
  @IsOptional({ always: true })
  @IsDateString({ groups: [CREATE, UPDATE] })
  @ApiProperty({ required: false, type: Date })
  competitionTime?: Date;

  @Column()
  @IsOptional({ groups: [UPDATE] })
  @IsNumber({}, { always: true })
  @ApiProperty({ required: true })
  competitionId!: number;

  @Column({ nullable: true })
  @IsOptional({ always: true })
  @IsNumber({}, { always: true })
  @ApiProperty({ required: false })
  platformId?: number;

  /* Relations */

  @ManyToOne(() => CompetitionEntity, (competition) => competition.groups)
  competition!: IEntity<ICompetition>;

  @ManyToOne(() => PlatformEntity, (platform) => platform.groups, {
    onDelete: "SET NULL",
  })
  @Type(() => PlatformEntity)
  platform!: IEntity<IPlatform>;

  @OneToMany(() => LifterEntity, (lifter) => lifter.group, {
    cascade: ["insert", "update"],
  })
  lifters!: IEntity<LifterData>[];
  toString() {
    return this.name;
  }
}
