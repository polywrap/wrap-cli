import { PolywrapManifest, PolywrapManifest_0_1 } from "..";

export const migrate = (manifest: PolywrapManifest_0_1): PolywrapManifest => {
  const shouldHaveExtensions =
    manifest.build || manifest.deploy || manifest.meta;

  const maybeExtensions = {
    build: manifest.build,
    deploy: manifest.deploy,
    meta: manifest.meta,
  };

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
    extensions: shouldHaveExtensions ? maybeExtensions : undefined,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __type: "PolywrapManifest",
  };
};
