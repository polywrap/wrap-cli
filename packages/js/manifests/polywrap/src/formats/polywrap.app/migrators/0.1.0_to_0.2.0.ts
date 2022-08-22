import { AppManifest as OldManifest } from "../0.1.0";
import { AppManifest as NewManifest } from "../0.2.0";

export function migrate(manifest: OldManifest): NewManifest {
  return {
    format: "0.2.0",
    project: {
      name: manifest.name,
      type: manifest.language,
    },
    source: {
      schema: manifest.schema,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      import_abis: manifest.import_redirects?.map((x) => ({
        uri: x.uri,
        abi: x.schema,
      })),
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __type: "AppManifest",
  };
};
