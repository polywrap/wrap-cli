# @polywrap/fs-resolver-plugin-js

Filesystem Resolver Plugin allows the Polywrap JS Client to resolve URIs from the local filesystem.

## Usage

``` typescript
import { PolywrapClient } from "@polywrap/client-js";
import {
  initTestEnvironment,
  providers,
  ensAddresses,
  stopTestEnvironment,
  buildWrapper,
} from "@polywrap/test-env-js";
import { filesystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { filesystemPlugin } from "@polywrap/fs-plugin-js";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";

// invoke a local wrapper
export async function foo({

  // spin up docker containers with Ganache and IPFS.
  await initTestEnvironment();

  // initialize the client with fs plugins
  client = new PolywrapClient({
    plugins: [
      {
        uri: "wrap://ens/fs-resolver.polywrap.eth",
        plugin: fileSystemResolverPlugin({}),
      },
      {
        uri: "wrap://ens/wrappers.polywrap.eth:file-system@1.0.0",
        plugin: filesystemPlugin({}),
      }
    ],
  });

  // get filesystem path
  const wrapperPath = `/path/to/simple-storage`;

  // build locally
  await buildWrapper(wrapperPath, undefined, true);
  const buildPath = `${wrapperPath}/build`;

  // get filesystem URI
  const wrapperUriFS = `fs/${fsPath}`;

  // invoke wrapper from filesystem
  const deploy = await client.invoke<string>({
    uri: wrapperUriFS,
    method: "deployContract",
    args: {
      connection: {
        networkNameOrChainId: "testnet"
      }
    },
  });

  // invoke the wrapper
  const schemaFS = await client.getManifest(wrapperUriFS)

  await stopTestEnvironment();
});
```

For more usage examples see `src/__tests__`.

## API

Filesystem Resolver Plugin conforms to a generic UriResolver interface that provides tryResolveUri and getFile methods to the Polywrap client and adds filesystem resolution capability to every client method, e.g. getManifest, resolveUri.
