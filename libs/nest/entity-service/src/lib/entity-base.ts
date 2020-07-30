import { IEntity } from "@dt/util";
import { PrimaryGeneratedColumn } from "typeorm";

export abstract class EntityBase implements IEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  abstract toString(): string;
}
