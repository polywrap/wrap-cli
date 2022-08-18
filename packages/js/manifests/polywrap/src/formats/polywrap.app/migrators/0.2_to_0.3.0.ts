import { AppManifest, AppManifest_0_2 } from "..";

export const migrate = (manifest: AppManifest_0_2): AppManifest => {
  return {
    format: "0.3.0",
    project: {
      name: manifest.name,
      type: manifest.language,
    },
    source: {
      schema: manifest.schema,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      import_abis: manifest.import_abis,
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __type: "AppManifest",
  };
};
