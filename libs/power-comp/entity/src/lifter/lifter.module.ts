import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LifterEntity } from "./lifter.entity";
import { LifterController } from "./lifter.controller";
import { LifterEntityService } from "./lifter-entity.service";
import { LifterEntitySubscriber } from "./lifter-entity.subscriber";
import { WeightCategoryModule } from "../weight-category";

@Module({
  imports: [TypeOrmModule.forFeature([LifterEntity])],
  controllers: [LifterController],
  providers: [LifterEntityService, LifterEntitySubscriber],
  exports: [LifterEntityService]
})
export class LifterModule {}
