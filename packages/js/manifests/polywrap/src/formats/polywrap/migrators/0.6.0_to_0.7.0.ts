import { PolywrapManifest as OldManifest } from "../0.6.0";
import { PolywrapManifest as NewManifest } from "../0.7.0";

export function migrate(migrate: OldManifest): NewManifest {
  const newManifest: Partial<NewManifest> = {
    ...migrate,
    format: "0.7.0",
  };
  if (migrate.source) {
    newManifest["source"] = {};
    if (migrate.source.schema) {
      newManifest.source["schema"] = migrate.source.schema;
    }
    if (migrate.source.module) {
      newManifest.source["module"] = migrate.source.module;
    }
    if (migrate.source.import_abis) {
      newManifest["import_abis"] = migrate.source.import_abis;
    }
  }
  return newManifest as NewManifest;
}
