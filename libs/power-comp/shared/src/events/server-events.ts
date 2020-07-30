import { JudgeDecision } from "../data-types";
import { Clock } from "@dt/util";

export interface IServerPlatformEvents {
  decisions: JudgeDecision[];
  liftTimer: Clock;
  displayDecisions: number;
}
