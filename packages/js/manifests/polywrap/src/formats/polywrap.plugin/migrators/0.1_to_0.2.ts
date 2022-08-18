/* eslint-disable @typescript-eslint/naming-convention */

import { PluginManifest as OldManifest } from "../0.1";
import { PluginManifest as NewManifest } from "../0.2";

export function migrate(oldFormat: OldManifest): NewManifest {
  return {
    __type: "PluginManifest",
    format: "0.2",
    name: oldFormat.name,
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
