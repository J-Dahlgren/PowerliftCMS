import { environment } from "../environments/environment";
import { LogLevel } from "@dt/util";
import { join } from "path";
import { homedir } from "os";
export default () => {
  return {
    port: process.env.PORT || environment.serverPort,
    database: {
      name:
        process.env.DATABASE_NAME ||
        join(homedir(), "power-comp", environment.defaultDatabase)
    },
    logLevel:
      (process.env.LOG_LEVEL as keyof typeof LogLevel | undefined) ||
      (LogLevel[environment.logLevel] as keyof typeof LogLevel)
  };
};
