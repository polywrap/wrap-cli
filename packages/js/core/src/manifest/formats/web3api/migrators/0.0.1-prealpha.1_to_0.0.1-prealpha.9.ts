/* eslint-disable @typescript-eslint/naming-convention */

import { Web3ApiManifest as OldManifest } from "../0.0.1-prealpha.1";
import { Web3ApiManifest as NewManifest } from "../0.0.1-prealpha.9";

export function migrate(old: OldManifest): NewManifest {
  delete old.repository;
  const module = old.mutation || old.query;

  if (!module) {
    throw Error("No module found.");
  }

  const language = module.module.language;

  const modules: Record<
    string,
    {
      schema: string;
      module: string;
    }
  > = {};

  if (old.mutation) {
    modules["mutation"] = {
      schema: old.mutation.schema.file,
      module: old.mutation.module.file,
    };
  }

  if (old.query) {
    modules["query"] = {
      schema: old.query.schema.file,
      module: old.query.module.file,
    };
  }

  return {
    __type: "Web3ApiManifest",
    format: "0.0.1-prealpha.9",
    name: "Unnamed",
    language,
    modules,
    import_redirects: old.import_redirects,
  };
}
