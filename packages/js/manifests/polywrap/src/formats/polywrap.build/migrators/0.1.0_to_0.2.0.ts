/* eslint-disable @typescript-eslint/naming-convention */

import { BuildManifest as OldManifest } from "../0.1.0";
import { BuildManifest as NewManifest } from "../0.2.0";

export function migrate(old: OldManifest): NewManifest {
  return {
    ...old,
    __type: "BuildManifest",
    format: "0.2.0",
    strategies: {
      image: {
        ...old.docker,
        node_version: (old.config?.node_version as string) ?? "16.13.0",
        include: (old.config?.include as string[]) ?? ["./package.json"],
      },
    },
  };
}
