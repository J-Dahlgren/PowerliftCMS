import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlatformEntity } from "./platform.entity";
import { PlatformEntitySubscriber } from "./platform-entity.subscriber";
import { PlatformController } from "./platform.controller";
import { PlatformEntityService } from "./platform-entity.service";

@Module({
  imports: [TypeOrmModule.forFeature([PlatformEntity])],
  controllers: [PlatformController],
  providers: [PlatformEntityService, PlatformEntitySubscriber],
  exports: [PlatformEntityService],
})
export class PlatformModule {}
