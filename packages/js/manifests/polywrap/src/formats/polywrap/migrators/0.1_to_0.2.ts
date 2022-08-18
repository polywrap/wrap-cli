/* eslint-disable @typescript-eslint/naming-convention */

import { PolywrapManifest as OldManifest } from "../0.1";
import { PolywrapManifest as NewManifest } from "../0.2";

export function migrate(oldFormat: OldManifest): NewManifest {
  return {
    __type: "PolywrapManifest",
    format: "0.2",
    name: oldFormat.name,
    build: oldFormat.build,
    meta: oldFormat.meta,
    deploy: oldFormat.deploy,
    language: oldFormat.language,
    module: oldFormat.module,
    schema: oldFormat.schema,
    import_abis: oldFormat.import_redirects?.map(
      (redirect) => ({
        uri: redirect.uri,
        abi: redirect.schema
      })
    )
  };
}
