import { IEnvironment } from "./IEnvironment";
import { defaultEnvironment } from "./environment.default";
import { Environment } from "@pc/power-comp/shared";
import { LogLevel } from "@pc/util";

export const environment: IEnvironment = {
  ...defaultEnvironment,
  type: Environment.CLOUD,
  logLevel: LogLevel.info,
  serverPort: 3334,
};
