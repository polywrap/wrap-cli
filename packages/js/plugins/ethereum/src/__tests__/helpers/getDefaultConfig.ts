import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { ethereumPlugin, Connections } from "../..";
import { defaultInterfaces, defaultPackages } from "@polywrap/client-config-builder-js";
import { Uri } from "@polywrap/core-js";
import { ClientConfig } from "@polywrap/client-js";

export const getDefaultConfig = (
  connections: Connections
): Partial<ClientConfig> => {
  return {
    interfaces: [
      {
        interface: ExtendableUriResolver.extInterfaceUri,
        implementations: [Uri.from(defaultPackages.fileSystemResolver)],
      },
    ],
    packages: [
      {
        uri: Uri.from(defaultPackages.ethereum),
        package: ethereumPlugin({ connections }),
      },
      {
        uri: Uri.from(defaultPackages.fileSystemResolver),
        package: fileSystemResolverPlugin({}),
      },
      {
        uri: Uri.from(defaultInterfaces.fileSystem),
        package: fileSystemPlugin({}),
      },
    ],
  };
};
