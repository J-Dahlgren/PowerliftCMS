import { Environment } from "@dt/power-comp/shared";
import { LogLevel } from "@dt/util";
export interface IEnvironment {
  type: Environment;
  logLevel: LogLevel;
  serverPort: number;
  defaultDatabase: string;
}
