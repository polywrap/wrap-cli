/* eslint-disable @typescript-eslint/naming-convention */

import { PluginManifest as OldManifest } from "../0.0.1-prealpha.2";
import { PluginManifest as NewManifest } from "../0.0.1-prealpha.3";

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
    __type: "PluginManifest",
    format: "0.0.1-prealpha.3",
    modules,
  };
}
