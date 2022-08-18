/* eslint-disable @typescript-eslint/naming-convention */

import { AppManifest as OldManifest } from "../0.1";
import { AppManifest as NewManifest } from "../0.2";

export function migrate(oldFormat: OldManifest): NewManifest {
  return {
    __type: "AppManifest",
    format: "0.2",
    name: oldFormat.name,
    language: oldFormat.language,
    schema: oldFormat.schema,
    import_abis: oldFormat.import_redirects?.map(
      (redirect) => ({
        uri: redirect.uri,
        abi: redirect.schema
      })
    )
  };
}
