import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { ethereumPlugin, Connections } from "../..";
import { ETH_ENS_IPFS_MODULE_CONSTANTS } from "@polywrap/cli-js";
import {
  defaultIpfsProviders,
} from "@polywrap/client-config-builder-js";
import { Uri } from "@polywrap/core-js";
import { ClientConfig } from "@polywrap/client-js";

export const getDefaultConfig = (
  connections: Connections
): Partial<ClientConfig> => {
  return {
    envs: [
      {
        uri: Uri.from("wrap://ens/ipfs.polywrap.eth"),
        env: {
          provider: ETH_ENS_IPFS_MODULE_CONSTANTS.ipfsProvider,
          fallbackProviders: defaultIpfsProviders,
        },
      },
    ],
    interfaces: [
      {
        interface: ExtendableUriResolver.extInterfaceUri,
        implementations: [Uri.from("wrap://ens/fs-resolver.polywrap.eth")],
      },
    ],
    packages: [
      {
        uri: Uri.from("wrap://ens/ethereum.polywrap.eth"),
        package: ethereumPlugin({ connections }),
      },
      {
        uri: Uri.from("wrap://ens/fs-resolver.polywrap.eth"),
        package: fileSystemResolverPlugin({}),
      },
      {
        uri: Uri.from("wrap://ens/fs.polywrap.eth"),
        package: fileSystemPlugin({}),
      },
    ],
  };
};
