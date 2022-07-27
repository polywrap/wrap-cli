import { AppManifest, AppManifest_0_1 } from "..";

export const migrate = (manifest: AppManifest_0_1): AppManifest => {
  return {
    format: "0.2",
    project: {
      name: manifest.name,
      type: manifest.language,
    },
    source: {
      schema: manifest.schema,
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    import_redirects: manifest.import_redirects,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __type: "AppManifest",
  };
};
