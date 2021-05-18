import { JudgeDecision } from "../data-types";
import { Clock } from "@pc/util";

export interface IServerPlatformEvents {
  decisions: JudgeDecision[];
  liftTimer: Clock;
  displayDecisions: number;
}
