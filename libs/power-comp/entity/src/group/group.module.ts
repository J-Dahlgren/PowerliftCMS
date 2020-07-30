import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupEntity } from "./group.entity";
import { GroupEntitySubscriber } from "./group-entity.subscriber";
import { GroupController } from "./group.controller";
import { GroupEntityService } from "./group-entity.service";

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity])],
  controllers: [GroupController],
  providers: [GroupEntityService, GroupEntitySubscriber],
  exports: [GroupEntityService]
})
export class GroupModule {}
