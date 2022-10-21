import { coreInterfaceUris, Uri } from "@polywrap/core-js";
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
): Partial<ClientConfig<Uri | string>> => {
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
        interface: coreInterfaceUris.uriResolver,
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
