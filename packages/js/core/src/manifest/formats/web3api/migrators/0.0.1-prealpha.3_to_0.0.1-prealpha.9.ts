/* eslint-disable @typescript-eslint/naming-convention */

import { Web3ApiManifest as OldManifest } from "../0.0.1-prealpha.3";
import { Web3ApiManifest as NewManifest } from "../0.0.1-prealpha.8";

export function migrate(old: OldManifest): NewManifest {
  delete old.repository;
  let language = old.language;

  if (!language) {
    if (old.interface) {
      language = "interface";
    } else {
      language = "wasm/assemblyscript";
    }
  }

  return {
    __type: "Web3ApiManifest",
    format: "0.0.1-prealpha.8",
    name: "Unnamed",
    build: old.build,
    language,
    modules: old.modules,
    import_redirects: old.import_redirects,
  };
}
