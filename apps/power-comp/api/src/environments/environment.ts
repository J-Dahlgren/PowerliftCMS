import { IEnvironment } from "./IEnvironment";

import { defaultEnvironment } from "./environment.default";
import { LogLevel } from "@dt/util";

export const environment: IEnvironment = {
  ...defaultEnvironment,
  logLevel: LogLevel.trace,
  defaultDatabase: "db/power-comp.sqlite"
};
