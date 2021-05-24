import { IEnvironment } from "./IEnvironment";
import { Environment } from "@pc/power-comp/shared";
import { LogLevel } from "@pc/util";

export const defaultEnvironment: IEnvironment = {
  type: Environment.DEVELOP,
  logLevel: LogLevel.info,
};
