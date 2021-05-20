const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class CreateDatabase1621491891899 {
  name = "CreateDatabase1621491891899";

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "weight_category_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "active" boolean NOT NULL DEFAULT (1), "minExclusive" integer NOT NULL, "maxInclusive" integer, "gender" varchar CHECK( gender IN ('m','f') ) NOT NULL, "competitionId" integer NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "lifter_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "lot" integer NOT NULL, "competitionId" integer NOT NULL, "groupId" integer, "lifts" text NOT NULL, "license" varchar, "firstname" varchar NOT NULL, "lastname" varchar NOT NULL, "gender" varchar CHECK( gender IN ('m','f') ) NOT NULL, "bornYear" integer, "bodyWeight" integer, "equipped" boolean NOT NULL DEFAULT (0), "team" varchar, "settings" text NOT NULL, "weightCategoryId" integer)`
    );
    await queryRunner.query(
      `CREATE TABLE "group_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "weighInTime" datetime, "competitionTime" datetime, "competitionId" integer NOT NULL, "platformId" integer)`
    );
    await queryRunner.query(
      `CREATE TABLE "platform_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "competitionId" integer NOT NULL, "name" varchar NOT NULL, "weights" text NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "competition_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "city" varchar, "location" varchar, "active" boolean NOT NULL DEFAULT (1))`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_weight_category_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "active" boolean NOT NULL DEFAULT (1), "minExclusive" integer NOT NULL, "maxInclusive" integer, "gender" varchar CHECK( gender IN ('m','f') ) NOT NULL, "competitionId" integer NOT NULL, CONSTRAINT "FK_5bbf38b72de0d25537d566d1d3e" FOREIGN KEY ("competitionId") REFERENCES "competition_entity" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_weight_category_entity"("id", "active", "minExclusive", "maxInclusive", "gender", "competitionId") SELECT "id", "active", "minExclusive", "maxInclusive", "gender", "competitionId" FROM "weight_category_entity"`
    );
    await queryRunner.query(`DROP TABLE "weight_category_entity"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_weight_category_entity" RENAME TO "weight_category_entity"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_lifter_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "lot" integer NOT NULL, "competitionId" integer NOT NULL, "groupId" integer, "lifts" text NOT NULL, "license" varchar, "firstname" varchar NOT NULL, "lastname" varchar NOT NULL, "gender" varchar CHECK( gender IN ('m','f') ) NOT NULL, "bornYear" integer, "bodyWeight" integer, "equipped" boolean NOT NULL DEFAULT (0), "team" varchar, "settings" text NOT NULL, "weightCategoryId" integer, CONSTRAINT "FK_870e575361ac8dbf203394c4f8c" FOREIGN KEY ("competitionId") REFERENCES "competition_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7b38f72fc3ec2d3a56c1a5c8395" FOREIGN KEY ("groupId") REFERENCES "group_entity" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_a2127e5a861c5dc42b28153f85c" FOREIGN KEY ("weightCategoryId") REFERENCES "weight_category_entity" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_lifter_entity"("id", "lot", "competitionId", "groupId", "lifts", "license", "firstname", "lastname", "gender", "bornYear", "bodyWeight", "equipped", "team", "settings", "weightCategoryId") SELECT "id", "lot", "competitionId", "groupId", "lifts", "license", "firstname", "lastname", "gender", "bornYear", "bodyWeight", "equipped", "team", "settings", "weightCategoryId" FROM "lifter_entity"`
    );
    await queryRunner.query(`DROP TABLE "lifter_entity"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_lifter_entity" RENAME TO "lifter_entity"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_group_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "weighInTime" datetime, "competitionTime" datetime, "competitionId" integer NOT NULL, "platformId" integer, CONSTRAINT "FK_4945b975e3500b1c47b51d50698" FOREIGN KEY ("competitionId") REFERENCES "competition_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_71e8c7a4407ca71f4f817f8c1d0" FOREIGN KEY ("platformId") REFERENCES "platform_entity" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_group_entity"("id", "name", "weighInTime", "competitionTime", "competitionId", "platformId") SELECT "id", "name", "weighInTime", "competitionTime", "competitionId", "platformId" FROM "group_entity"`
    );
    await queryRunner.query(`DROP TABLE "group_entity"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_group_entity" RENAME TO "group_entity"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_platform_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "competitionId" integer NOT NULL, "name" varchar NOT NULL, "weights" text NOT NULL, CONSTRAINT "FK_c4f42a1c68b0977822e2894b2f7" FOREIGN KEY ("competitionId") REFERENCES "competition_entity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_platform_entity"("id", "competitionId", "name", "weights") SELECT "id", "competitionId", "name", "weights" FROM "platform_entity"`
    );
    await queryRunner.query(`DROP TABLE "platform_entity"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_platform_entity" RENAME TO "platform_entity"`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "platform_entity" RENAME TO "temporary_platform_entity"`
    );
    await queryRunner.query(
      `CREATE TABLE "platform_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "competitionId" integer NOT NULL, "name" varchar NOT NULL, "weights" text NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "platform_entity"("id", "competitionId", "name", "weights") SELECT "id", "competitionId", "name", "weights" FROM "temporary_platform_entity"`
    );
    await queryRunner.query(`DROP TABLE "temporary_platform_entity"`);
    await queryRunner.query(
      `ALTER TABLE "group_entity" RENAME TO "temporary_group_entity"`
    );
    await queryRunner.query(
      `CREATE TABLE "group_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "weighInTime" datetime, "competitionTime" datetime, "competitionId" integer NOT NULL, "platformId" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "group_entity"("id", "name", "weighInTime", "competitionTime", "competitionId", "platformId") SELECT "id", "name", "weighInTime", "competitionTime", "competitionId", "platformId" FROM "temporary_group_entity"`
    );
    await queryRunner.query(`DROP TABLE "temporary_group_entity"`);
    await queryRunner.query(
      `ALTER TABLE "lifter_entity" RENAME TO "temporary_lifter_entity"`
    );
    await queryRunner.query(
      `CREATE TABLE "lifter_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "lot" integer NOT NULL, "competitionId" integer NOT NULL, "groupId" integer, "lifts" text NOT NULL, "license" varchar, "firstname" varchar NOT NULL, "lastname" varchar NOT NULL, "gender" varchar CHECK( gender IN ('m','f') ) NOT NULL, "bornYear" integer, "bodyWeight" integer, "equipped" boolean NOT NULL DEFAULT (0), "team" varchar, "settings" text NOT NULL, "weightCategoryId" integer)`
    );
    await queryRunner.query(
      `INSERT INTO "lifter_entity"("id", "lot", "competitionId", "groupId", "lifts", "license", "firstname", "lastname", "gender", "bornYear", "bodyWeight", "equipped", "team", "settings", "weightCategoryId") SELECT "id", "lot", "competitionId", "groupId", "lifts", "license", "firstname", "lastname", "gender", "bornYear", "bodyWeight", "equipped", "team", "settings", "weightCategoryId" FROM "temporary_lifter_entity"`
    );
    await queryRunner.query(`DROP TABLE "temporary_lifter_entity"`);
    await queryRunner.query(
      `ALTER TABLE "weight_category_entity" RENAME TO "temporary_weight_category_entity"`
    );
    await queryRunner.query(
      `CREATE TABLE "weight_category_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "active" boolean NOT NULL DEFAULT (1), "minExclusive" integer NOT NULL, "maxInclusive" integer, "gender" varchar CHECK( gender IN ('m','f') ) NOT NULL, "competitionId" integer NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "weight_category_entity"("id", "active", "minExclusive", "maxInclusive", "gender", "competitionId") SELECT "id", "active", "minExclusive", "maxInclusive", "gender", "competitionId" FROM "temporary_weight_category_entity"`
    );
    await queryRunner.query(`DROP TABLE "temporary_weight_category_entity"`);
    await queryRunner.query(`DROP TABLE "competition_entity"`);
    await queryRunner.query(`DROP TABLE "platform_entity"`);
    await queryRunner.query(`DROP TABLE "group_entity"`);
    await queryRunner.query(`DROP TABLE "lifter_entity"`);
    await queryRunner.query(`DROP TABLE "weight_category_entity"`);
  }
};
