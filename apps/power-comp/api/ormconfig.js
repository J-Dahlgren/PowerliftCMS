const { homedir } = require("os");

const { config } = require("dotenv");
const { join, resolve } = require("path");
const { getmeta } = require("typeorm");
config({ path: "power-comp.env" });

const defaultStorageLocation = join(homedir(), "power-comp");
const storage = process.env.STORAGE_PATH || defaultStorageLocation;

const ormConfig = {
  type: "sqlite",
  database:
    process.env.DATABASE_NAME === ":memory:"
      ? ":memory:"
      : join(storage, "db", process.env.DATABASE_NAME || "power-comp.sqlite"),
  entities: ["dist/out-tsc/libs/**/*.entity{.ts,.js}"],
  cli: {
    migrationsDir: "apps/power-comp/api/src/assets/migration",
  },
};
console.log(ormConfig);
module.exports = ormConfig;
