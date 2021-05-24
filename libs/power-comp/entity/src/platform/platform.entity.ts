import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { IEntity } from "@pc/util";
import { IPlatform, ICompetition } from "@pc/power-comp/shared";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { CompetitionEntity } from "../competition/competition.entity";
import { GroupEntity } from "../group/group.entity";
import { PlatformWeights } from "./weights";
import {
  IsOptional,
  IsNumber,
  IsString,
  ValidateNested,
  IsArray,
} from "class-validator";
import { UPDATE } from "@pc/nest/util";
import { EntityBase } from "@pc/nest/entity-service";

@Entity()
export class PlatformEntity extends EntityBase implements IEntity<IPlatform> {
  @Column()
  @IsOptional({ groups: [UPDATE] })
  @IsNumber({}, { always: true })
  @ApiProperty({ required: true })
  competitionId!: number;

  @Column({ nullable: false })
  @IsOptional({ groups: [UPDATE] })
  @IsString({ always: true })
  @ApiProperty({ required: true })
  name!: string;

  @Column("simple-json")
  @IsOptional({ groups: [UPDATE] })
  @ValidateNested({ always: true, each: true })
  @ApiProperty({ type: PlatformWeights, required: true })
  @Type(() => PlatformWeights)
  weights!: PlatformWeights;

  /* Relations */

  @OneToMany(() => GroupEntity, (group) => group.platform, {
    cascade: ["insert", "update"],
  })
  @IsOptional({ always: true })
  @IsArray({ always: true })
  @ValidateNested({ always: true, each: true })
  //@ApiProperty({ required: false, type: () => [GroupEntity] })
  @Type(() => GroupEntity)
  groups!: IEntity<GroupEntity>[];

  @ManyToOne(() => CompetitionEntity, (competition) => competition.platforms, {
    cascade: [],
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  competition!: IEntity<ICompetition>;

  toString() {
    return this.name;
  }
}
