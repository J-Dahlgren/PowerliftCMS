import { IEnvironment } from "./IEnvironment";
import { defaultEnvironment } from "./environment.default";
import { Environment } from "@dt/power-comp/shared";
import { LogLevel } from "@dt/util";

export const environment: IEnvironment = {
  ...defaultEnvironment,
  type: Environment.STANDALONE,
  logLevel: LogLevel.info,
  serverPort: 80
};
