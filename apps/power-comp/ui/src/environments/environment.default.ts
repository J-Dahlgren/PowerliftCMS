import { IEnvironment } from "./IEnvironment";
import { Environment } from "@dt/power-comp/shared";
import { LogLevel } from "@dt/util";

export const defaultEnvironment: IEnvironment = {
  type: Environment.DEVELOP,
  logLevel: LogLevel.info
};
