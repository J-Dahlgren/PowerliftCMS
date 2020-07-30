import { Module } from "@nestjs/common";
import {
  CompetitionModule,
  PlatformModule,
  GroupModule,
  LifterModule,
  WeightCategoryModule
} from "@dt/power-comp/entity";
@Module({
  imports: [
    CompetitionModule,
    PlatformModule,
    GroupModule,
    LifterModule,
    WeightCategoryModule
  ],
  exports: [
    CompetitionModule,
    PlatformModule,
    GroupModule,
    LifterModule,
    WeightCategoryModule
  ]
})
export class ApiModule {}
