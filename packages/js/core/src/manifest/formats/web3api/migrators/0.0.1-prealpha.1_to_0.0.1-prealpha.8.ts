/* eslint-disable @typescript-eslint/naming-convention */

import { Web3ApiManifest as OldManifest } from "../0.0.1-prealpha.1";
import { Web3ApiManifest as NewManifest } from "../0.0.1-prealpha.8";

export function migrate(old: OldManifest): NewManifest {
  delete old.repository;
  const module = old.mutation || old.query;

  if (!module) {
    throw Error("No module found.");
  }

  const language = module.module.language;

  return {
    __type: "Web3ApiManifest",
    format: "0.0.1-prealpha.8",
    name: "Unnamed",
    language,
    modules: {
      mutation: old.mutation
        ? {
            schema: old.mutation.schema.file,
            module: old.mutation.module.file,
          }
        : undefined,
      query: old.query
        ? {
            schema: old.query.schema.file,
            module: old.query.module.file,
          }
        : undefined,
    },
    import_redirects: old.import_redirects,
  };
}
