import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { ethereumPlugin, Connections } from "../..";
import { providers } from "@polywrap/test-env-js";
import {
  defaultIpfsProviders,
  ClientConfig,
} from "@polywrap/client-config-builder-js";

export const getDefaultConfig = (
  connections: Connections
): Partial<ClientConfig> => {
  return {
    envs: [
      {
        uri: "wrap://ens/ipfs.polywrap.eth",
        env: {
          provider: providers.ipfs,
          fallbackProviders: defaultIpfsProviders,
        },
      },
    ],
    interfaces: [
      {
        interface: ExtendableUriResolver.extInterfaceUri,
        implementations: ["wrap://ens/fs-resolver.polywrap.eth"],
      },
    ],
    packages: [
      {
        uri: "wrap://ens/ethereum.polywrap.eth",
        package: ethereumPlugin({ connections }),
      },
      {
        uri: "wrap://ens/fs-resolver.polywrap.eth",
        package: fileSystemResolverPlugin({}),
      },
      {
        uri: "wrap://ens/fs.polywrap.eth",
        package: fileSystemPlugin({}),
      },
    ],
  };
};
