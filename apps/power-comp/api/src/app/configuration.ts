import { environment } from "../environments/environment";
import { LogLevel } from "@dt/util";

export default () => {
  return {
    port: process.env.PORT || environment.serverPort,
    database: {
      name: process.env.DATABASE_NAME || environment.defaultDatabase
    },
    logLevel:
      (process.env.LOG_LEVEL as keyof typeof LogLevel | undefined) ||
      (LogLevel[environment.logLevel] as keyof typeof LogLevel)
  };
};
