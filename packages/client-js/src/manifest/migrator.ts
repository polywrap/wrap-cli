import Manifests from "./versions";

enum Versions {
  "0.0.1-alpha.1" = "0.0.1-alpha.1",
  "0.0.1-alpha.2" = "0.0.1-alpha.2",
}

type Migrator = {
  [key in Versions]?: {
    upgrades: {
      [key in Versions]?: { migrate: (m: Manifests) => Manifests };
    };
  };
};

export const migrators: Migrator = {
  "0.0.1-alpha.1": {
    upgrades: {
      "0.0.1-alpha.2": require("./migrators/0_0_1-alpha.1-0_0_1-alpha.2"),
    },
  },
};

export const upgradeManifest = (manifest: Manifests, to: string) => {
  const from = manifest.version as Versions;
  const currentVersionMigrator = migrators[from];
  if (!currentVersionMigrator) {
    throw new Error(`From version ${from} doesn't exists`);
  }

  const upgradeFile = currentVersionMigrator["upgrades"][to as Versions];
  if (!upgradeFile) {
    throw new Error(
      `Version to update ${to} is not available in migrator of version ${from}`
    );
  }

  return upgradeFile.migrate(manifest);
};
