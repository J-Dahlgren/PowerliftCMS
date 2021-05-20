import { environment } from "../environments/environment";
import { LogLevel } from "@pc/util";
import { join } from "path";
import { homedir } from "os";
import { v4 } from "uuid";
import { Environment } from "@pc/power-comp/shared";
export default () => {
  const defaultStorageLocation = join(homedir(), "power-comp");
  const storage = process.env.STORAGE_PATH || defaultStorageLocation;
  const inMemoryDB = process.env.DATABASE_NAME === ":memory:";
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
              storage,
              "db",
              process.env.DATABASE_NAME || environment.defaultDatabase
            ),
      runMigrations: !inMemoryDB && environment.type !== Environment.STANDALONE,
      synchronize: inMemoryDB || environment.type === Environment.STANDALONE
    },
    logLevel:
      (process.env.LOG_LEVEL as keyof typeof LogLevel | undefined) ||
      (LogLevel[environment.logLevel] as keyof typeof LogLevel)
  };
};
