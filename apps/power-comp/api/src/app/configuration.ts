import { environment } from "../environments/environment";
import { LogLevel } from "@dt/util";
import { join, resolve } from "path";
import { homedir } from "os";
export default () => {
  const defaultStorageLocation = join(homedir(), "power-comp");
  return {
    port: process.env.PORT || environment.serverPort,
    storageLocation: process.env.STORAGE_PATH || defaultStorageLocation,
    database: {
      name:
        process.env.DATABASE_NAME === ":memory:"
          ? ":memory:"
          : join(
              defaultStorageLocation,
              "db",
              process.env.DATABASE_NAME || environment.defaultDatabase
            )
    },
    logLevel:
      (process.env.LOG_LEVEL as keyof typeof LogLevel | undefined) ||
      (LogLevel[environment.logLevel] as keyof typeof LogLevel)
  };
};
