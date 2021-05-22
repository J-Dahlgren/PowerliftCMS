import { Environment } from "@pc/power-comp/shared";
import { LogLevel } from "@pc/util";
export interface IEnvironment {
  type: Environment;
  logLevel: LogLevel;
  serverPort: number;
  defaultDatabase: string;
  migrations: string[];
  assetsDir: string;
  availableLanguages: string[];
}
