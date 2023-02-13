import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { ethereumPlugin, Connections } from "../..";
import { CoreClientConfig } from "@polywrap/core-js";
import {
  ClientConfigBuilder,
  defaultInterfaces,
  defaultPackages,
} from "@polywrap/client-js";

export const getDefaultConfig = (
  connections: Connections
): CoreClientConfig => {
  const config = new ClientConfigBuilder()
    .addDefaults()
    .add({
      interfaces: {
        [ExtendableUriResolver.extInterfaceUri.uri]: new Set([
          defaultPackages.fileSystemResolver,
        ]),
      },
      packages: {
        [defaultPackages.ethereum]: ethereumPlugin({ connections }),
        [defaultPackages.fileSystemResolver]: fileSystemResolverPlugin({}),
        [defaultInterfaces.fileSystem]: fileSystemPlugin({}),
      },
    })
    .build();

  return config;
};
