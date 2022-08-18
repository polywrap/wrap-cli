import { PolywrapManifest, PolywrapManifest_0_2 } from "..";

export const migrate = (manifest: PolywrapManifest_0_2): PolywrapManifest => {
  const shouldHaveExtensions =
    manifest.build || manifest.deploy || manifest.meta;

  const maybeExtensions = {
    build: manifest.build,
    deploy: manifest.deploy,
    meta: manifest.meta,
  };

  return {
    format: "0.3.0",
    project: {
      name: manifest.name,
      type: manifest.language,
    },
    source: {
      schema: manifest.schema,
      module: manifest.module,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      import_abis: manifest.import_abis,
    },
    extensions: shouldHaveExtensions ? maybeExtensions : undefined,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __type: "PolywrapManifest",
  };
};
