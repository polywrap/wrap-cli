import { AnyManifest } from "./formats";
import {
  migrate as migrate_0_0_1_alpha_1_TO_0_0_1_alpha_2
} from "./migrators/0_0_1-alpha.1-0_0_1-alpha.2";

export enum ManifestFormats {
  "0.0.1-alpha.1" = "0.0.1-alpha.1",
  "0.0.1-alpha.2" = "0.0.1-alpha.2",
  "0.0.1-alpha.3" = "0.0.1-alpha.3"
}

type Migrator = {
  [key in ManifestFormats]?: {
    upgrades: {
      [key in ManifestFormats]?: (m: AnyManifest) => AnyManifest;
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

export const upgradeManifest = (manifest: AnyManifest, to: ManifestFormats) => {
  const from = manifest.format as ManifestFormats;

  if (!(from in ManifestFormats)) {
    throw new Error(`Unrecognized manifest format "${manifest.format}"`);
  }

  const currentFormatMigrator = migrators[from];
  if (!currentFormatMigrator) {
    throw new Error(`From format ${from} migrator does not exists`);
  }

  const upgradeMigrator = currentFormatMigrator.upgrades[to];
  if (!upgradeMigrator) {
    throw new Error(
      `Format to update ${to} is not available in migrator of format ${from}`
    );
  }

  return upgradeMigrator(manifest);
};
