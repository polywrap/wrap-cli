/* eslint-disable @typescript-eslint/naming-convention */

import { Web3ApiManifest as OldManifest } from "../0.0.1-prealpha.7";
import { Web3ApiManifest as NewManifest } from "../0.0.1-prealpha.9";

export function migrate(old: OldManifest): NewManifest {
  const modules: Record<
    string,
    {
      schema: string;
      module?: string;
    }
  > = {};

  if (old.modules.mutation) {
    modules["mutation"] = old.modules.mutation;
  }

  if (old.modules.query) {
    modules["query"] = old.modules.query;
  }

  return {
    ...old,
    modules,
    __type: "Web3ApiManifest",
    format: "0.0.1-prealpha.9",
  };
}
