import { writeFile, writeFileSync } from "fs";
import { compare, gt } from "semver";
import yaml from "js-yaml";
import storedMigrations from "./migrations.json";

export const saveMigration = (version: string, manifestObject: object) => {
  const migrations: any = storedMigrations;
  migrations[version] = manifestObject;
  const newMigration = JSON.stringify(migrations, null, 2);
  const migrationFile = __dirname + "/migrations.json";
  writeFile(migrationFile, newMigration, (error: Error | null) => {
    if (error) throw Error(error.message);
    console.log("Migration updated");
  });
};

const migrate = (newVersion: string) => {
  const versions = Object.keys(storedMigrations);

  const higherVersion: string = versions
    .filter((version: string) => gt(version, newVersion))
    .shift();

  const newManifest = yaml.dump((storedMigrations as any)[newVersion]);
  writeFileSync("./web3api.yaml", newManifest);

  if (!higherVersion) {
    return;
  }
  migrate(higherVersion);
};

export const migrator = (schema: any) => {
  const migrations = Object.keys(storedMigrations);
  if (migrations.length > 0) {
    const latestVersion = migrations.pop();
    if (compare(schema.version, latestVersion) <= 0) {
      const getHigherMigrations = (version: string) => gt(version, schema.version);
      const comingMigration = migrations.filter(getHigherMigrations).shift();
      migrate(comingMigration);
    }
  }
};
