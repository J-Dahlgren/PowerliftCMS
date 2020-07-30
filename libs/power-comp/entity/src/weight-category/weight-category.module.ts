import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WeightCategoryEntity } from "./weight-category.entity";
import { WeightCategoryController } from "./weight-category.controller";
import { WeightCategoryEntityService } from "./weight-category-entity.service";
import { WeightCategoryEntitySubscriber } from "./weight-category-entity.subscriber";

@Module({
  imports: [TypeOrmModule.forFeature([WeightCategoryEntity])],
  controllers: [WeightCategoryController],
  providers: [WeightCategoryEntityService, WeightCategoryEntitySubscriber],
  exports: [WeightCategoryEntityService]
})
export class WeightCategoryModule {}
