import { AnyManifest } from "./versions";
import {
  migrate as migrate_0_0_1_alpha_1_TO_0_0_1_alpha_2
} from "./migrators/0_0_1-alpha.1-0_0_1-alpha.2";

export enum ManifestVersions {
  "0.0.1-alpha.1" = "0.0.1-alpha.1",
  "0.0.1-alpha.2" = "0.0.1-alpha.2",
  "0.0.1-alpha.3" = "0.0.1-alpha.3"
}

type Migrator = {
  [key in ManifestVersions]?: {
    upgrades: {
      [key in ManifestVersions]?: (m: AnyManifest) => AnyManifest;
    };
  };
};

export const migrators: Migrator = {
  "0.0.1-alpha.1": {
    upgrades: {
      "0.0.1-alpha.2": migrate_0_0_1_alpha_1_TO_0_0_1_alpha_2,
    },
  },
};

export const upgradeManifest = (manifest: AnyManifest, to: ManifestVersions) => {
  const from = manifest.version as ManifestVersions;

  if (!(from in ManifestVersions)) {
    throw new Error(`Unrecognized manifest version "${manifest.version}"`);
  }

  const currentVersionMigrator = migrators[from];
  if (!currentVersionMigrator) {
    throw new Error(`From version ${from} migrator does not exists`);
  }

  const upgradeMigrator = currentVersionMigrator.upgrades[to];
  if (!upgradeMigrator) {
    throw new Error(
      `Version to update ${to} is not available in migrator of version ${from}`
    );
  }

  return upgradeMigrator(manifest);
};
