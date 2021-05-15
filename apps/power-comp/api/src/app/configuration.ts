import { environment } from "../environments/environment";
import { LogLevel } from "@dt/util";
import { join } from "path";
import { homedir } from "os";
import { v4 } from "uuid";
export default () => {
  const defaultStorageLocation = join(homedir(), "power-comp");
  return {
    port: process.env.PORT || environment.serverPort,
    storageLocation: process.env.STORAGE_PATH || defaultStorageLocation,
    auth: {
      password: process.env.PASSWORD || "",
      secret: process.env.JWT_SECRET || process.env.PASSWORD || v4()
    },
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
