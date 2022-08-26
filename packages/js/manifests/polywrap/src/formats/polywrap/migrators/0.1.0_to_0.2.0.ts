import { PolywrapManifest as OldManifest } from "../0.1.0";
import { PolywrapManifest as NewManifest } from "../0.2.0";

import path from "path";

export function migrate(manifest: OldManifest): NewManifest {
  const shouldHaveExtensions =
    manifest.build || manifest.deploy || manifest.meta;

  const maybeExtensions = {
    build: manifest.build,
    deploy: manifest.deploy,
    meta: manifest.meta,
  };

  return {
    format: "0.2.0",
    project: {
      name: manifest.name,
      type: manifest.language,
    },
    source: {
      schema: manifest.schema,
      module: manifest.module,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      import_abis: manifest.import_redirects?.map((x) => ({
        uri: x.uri,
        abi: path.join(path.dirname(x.schema), "wrap.info"),
      })),
    },
    extensions: shouldHaveExtensions ? maybeExtensions : undefined,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __type: "PolywrapManifest",
  };
}
