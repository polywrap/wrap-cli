import { AppManifest as OldManifest } from "../0.1.0";
import { AppManifest as NewManifest } from "../0.2.0";

import path from "path";

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
        abi: path.join(path.dirname(x.schema), "wrap.info"),
      })),
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __type: "AppManifest",
  };
}
