import { JudgeDecision } from "../data-types/decision";
import { Clock } from "@dt/util";

export interface IClientPlatformEvents {
  decision: {
    judgeNumber: number;
    d: keyof typeof JudgeDecision;
  };
  activeGroupId: number | undefined;
  liftTimer: Clock;
  secretariatDecision: boolean;
}
