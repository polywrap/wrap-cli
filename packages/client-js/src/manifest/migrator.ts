import Manifests from "./versions";

export const migrators = {
  "0.0.1-alpha.1": {
    upgrades: {
      "0.0.1-alpha.2": require("./migrators/0_0_1-alpha.1-0_0_1-alpha.2"),
    },
  },
};

type ExistingVersions = "0.0.1-alpha.1";
type LatestVersion = "0.0.1-alpha.2";

export const upgradeManifest = (manifest: Manifests, to: LatestVersion) => {
  const from = manifest.version as ExistingVersions;
  const currentVersionMigrator = migrators[from];
  if (!currentVersionMigrator) {
    throw new Error(`From version ${from} doesn't exists`);
  }

  const upgradeFile = currentVersionMigrator["upgrades"][to];
  if (!upgradeFile) {
    throw new Error(
      `Version to update ${to} is not available in migrator of version ${from}`
    );
  }

  return upgradeFile.migrate(manifest);
};
