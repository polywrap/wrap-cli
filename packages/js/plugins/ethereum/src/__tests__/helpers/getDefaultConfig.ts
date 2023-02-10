import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { ethereumPlugin, Connections } from "../..";
import { providers } from "@polywrap/test-env-js";
import { defaultIpfsProviders } from "@polywrap/client-config-builder-js";
import { CoreClientConfig } from "@polywrap/core-js";
import { ClientConfigBuilder } from "@polywrap/client-js";

export const getDefaultConfig = (
  connections: Connections
): CoreClientConfig => {
  const config = new ClientConfigBuilder()
    .addDefaults()
    .add({
      envs: {
        "wrap://ens/ipfs.polywrap.eth": {
          provider: providers.ipfs,
          fallbackProviders: defaultIpfsProviders,
        },
      },
      interfaces: {
        [ExtendableUriResolver.extInterfaceUri.uri]: new Set([
          "wrap://ens/fs-resolver.polywrap.eth",
        ]),
      },
      packages: {
        "wrap://ens/ethereum.polywrap.eth": ethereumPlugin({ connections }),
        "wrap://ens/fs-resolver.polywrap.eth": fileSystemResolverPlugin({}),
        "wrap://ens/fs.polywrap.eth": fileSystemPlugin({}),
      },
    })
    .build();

  return config;
};
