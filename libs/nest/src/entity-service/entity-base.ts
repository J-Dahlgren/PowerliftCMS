import { IEntity } from "@pc/util";
import { PrimaryGeneratedColumn } from "typeorm";

export abstract class EntityBase implements IEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  abstract toString(): string;
}
