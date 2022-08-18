import { PluginManifest, PluginManifest_0_1 } from "..";

export const migrate = (manifest: PluginManifest_0_1): PluginManifest => {
  return {
    format: "0.2.0",
    project: {
      name: manifest.name,
      type: manifest.language,
    },
    source: {
      schema: manifest.schema,
      module: manifest.module ?? "",
      // eslint-disable-next-line @typescript-eslint/naming-convention
      import_redirects: manifest.import_redirects,
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __type: "PluginManifest",
  };
};
