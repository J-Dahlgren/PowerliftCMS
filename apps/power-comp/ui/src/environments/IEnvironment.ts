import { Environment } from "@pc/power-comp/shared";
import { LogLevel } from "@pc/util";
export interface IEnvironment {
  type: Environment;
  logLevel: LogLevel;
}
