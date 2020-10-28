import { writeFile, writeFileSync } from "fs";
import { compare, gt } from "semver";
import YAML from "js-yaml";
import storedMigrations from "./migrations.json";
import { Manifest } from "./Manifest";

interface Migration {
  [version: string]: Manifest;
}

export const saveMigration = (version: string, manifestObject: Manifest) => {
  const migrations: Migration = {
    ...storedMigrations,
    [version]: manifestObject,
  };
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

  const newManifest = YAML.dump((storedMigrations as Migration)[newVersion]);
  writeFileSync("./web3api.yaml", newManifest);

  if (!higherVersion) {
    return;
  }
  migrate(higherVersion);
};

// Let's return true if the migrator needs to save the migration
// This means the user is building a new version (the highest one)
export const migrator = (schema: Manifest) => {
  const migrations = Object.keys(storedMigrations);
  if (migrations.length > 0) {
    const latestVersion = migrations.pop();
    if (compare(schema.version, latestVersion) <= 0) {
      const getHigherMigrations = (version: string) =>
        gt(version, schema.version);
      const comingMigration = migrations.filter(getHigherMigrations).shift();
      migrate(comingMigration);
      return false;
    }
    return true;
  }
  return true;
};
