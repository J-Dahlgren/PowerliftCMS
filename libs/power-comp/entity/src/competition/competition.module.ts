import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompetitionController } from "./competition.controller";
import { CompetitionEntity } from "./competition.entity";
import { CompetitionEntityService } from "./competition-entity.service";
import { CompetitionEntitySubscriber } from "./competition-entity.subscriber";
import { CompetitionIntegrityService } from "./competition-integrity.service";
import { WeightCategoryModule } from "../weight-category";
import { LifterModule } from "../lifter";

@Module({
  imports: [
    TypeOrmModule.forFeature([CompetitionEntity]),
    WeightCategoryModule,
    LifterModule
  ],
  controllers: [CompetitionController],
  providers: [
    CompetitionEntityService,
    CompetitionEntitySubscriber,
    CompetitionIntegrityService
  ],
  exports: [CompetitionEntityService]
})
export class CompetitionModule {}
