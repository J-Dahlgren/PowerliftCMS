import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { api } from "@pc/power-comp/shared";
import {
  ActiveGroupDto,
  JudgeDecisionDto,
  LiftTimerDto,
  SecretariatDecisionDto
} from "./platform-events";
import { PlatformEventService } from "./platform-event.service";
import { ApiTags, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { InternalEventBus } from "./internal-event-bus";
import { SimpleJwtGuard } from "@pc/nest/auth";

@ApiTags(api.events.root.toUpperCase())
@Controller(api.events.root)
@UseGuards(SimpleJwtGuard)
@ApiBearerAuth()
export class PlatformEventController {
  constructor(
    private eventService: PlatformEventService,
    private internalEvents: InternalEventBus
  ) {}

  @ApiBody({ type: ActiveGroupDto })
  @Post(api.events.activeGroupId)
  activeGroup(@Body() e: ActiveGroupDto) {
    this.eventService.emit(e.room.toString(), "activeGroupId", e.data);
  }

  @ApiBody({ type: JudgeDecisionDto })
  @Post(api.events.decision)
  decision(@Body() e: JudgeDecisionDto) {
    this.eventService.emit(e.room.toString(), "decision", e.data);
  }

  @ApiBody({ type: LiftTimerDto })
  @Post(api.events.liftTimer)
  liftTimer(@Body() e: LiftTimerDto) {
    this.internalEvents.emit(e.room.toString(), "setTimer", e.data);
  }

  @ApiBody({ type: SecretariatDecisionDto })
  @Post(api.events.secretariatDecision)
  secretariatDesision(@Body() e: SecretariatDecisionDto) {
    this.eventService.emit(e.room.toString(), "secretariatDecision", e.data);
  }
}
