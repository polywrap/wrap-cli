import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { ethereumPlugin, Connections } from "../..";
import { providers } from "@polywrap/test-env-js";
import {
  defaultIpfsProviders,
  ClientConfig,
  defaultInterfaces,
  defaultPackages,
} from "@polywrap/client-config-builder-js";

export const getDefaultConfig = (
  connections: Connections
): Partial<ClientConfig> => {
  return {
    envs: [
      {
        uri: defaultPackages.ipfsResolver,
        env: {
          provider: providers.ipfs,
          fallbackProviders: defaultIpfsProviders,
        },
      },
    ],
    interfaces: [
      {
        interface: ExtendableUriResolver.extInterfaceUri,
        implementations: [defaultPackages.fileSystemResolver],
      },
    ],
    packages: [
      {
        uri: "wrap://ens/ethereum.polywrap.eth",
        package: ethereumPlugin({ connections }),
      },
      {
        uri: defaultPackages.fileSystemResolver,
        package: fileSystemResolverPlugin({}),
      },
      {
        uri: defaultInterfaces.fileSystem,
        package: fileSystemPlugin({}),
      },
    ],
  };
};
