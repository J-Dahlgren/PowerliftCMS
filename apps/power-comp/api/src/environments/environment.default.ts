import { IEnvironment } from "./IEnvironment";
import { Environment } from "@pc/power-comp/shared";
import { LogLevel } from "@pc/util";

export const defaultEnvironment: IEnvironment = {
  type: Environment.DEVELOP,
  logLevel: LogLevel.trace,
  serverPort: 3333,
  defaultDatabase: "power-comp.sqlite",
  assetsDir: "dist/apps/power-comp/ui/assets",
  migrations: ["dist/apps/power-comp/api/assets/migration/**/*.js"],
  availableLanguages: ["en", "sv"],
};
