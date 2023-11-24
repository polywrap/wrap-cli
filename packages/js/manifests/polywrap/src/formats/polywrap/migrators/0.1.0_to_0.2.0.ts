import { PolywrapManifest as OldManifest } from "../0.1.0";
import { PolywrapManifest as NewManifest } from "../0.2.0";

import { ILogger } from "@polywrap/logging-js";

export function migrate(manifest: OldManifest, logger?: ILogger): NewManifest {
  const shouldHaveExtensions =
    manifest.build || manifest.deploy || manifest.meta;

  const maybeExtensions = {
    build: manifest.build,
    deploy: manifest.deploy,
    meta: manifest.meta,
  };

  if (
    manifest.import_redirects?.some((x) =>
      x.schema.includes("build/schema.graphql")
    )
  ) {
    logger?.warn(
      `Detected a reference to "build/schema.graphql" in "import_redirects". Consider using "build/wrap.info" instead of "build/schema.graphql" in "source.import_abis", schema.graphql is no longer emitted as a build artifact.`
    );
  }

  return {
    format: "0.2.0",
    project: {
      name: manifest.name,
      type: manifest.language,
    },
    source: {
      schema: manifest.schema,
      module: manifest.module,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      import_abis: manifest.import_redirects?.map((x) => ({
        uri: x.uri,
        abi: x.schema,
      })),
    },
    extensions: shouldHaveExtensions ? maybeExtensions : undefined,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __type: "PolywrapManifest",
  };
}
