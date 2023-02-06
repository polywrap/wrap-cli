# @polywrap/ipfs-resolver-plugin-js

IPFS Resolver Plugin allows the Polywrap JS Client to resolve wrapper URIs from IPFS.

## Usage

``` typescript
import { PolywrapClient } from "@polywrap/client-js";
import {
  initTestEnvironment,
  providers,
  stopTestEnvironment,
  buildAndDeployWrapper,
} from "@polywrap/test-env-js";

import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ipfsResolverPlugin } from "@polywrap/ipfs-resolver-plugin-js";
import createIpfsClient from "@polywrap/ipfs-http-client-lite";

// query wrapper at IPFS path
export async function foo({

  await initTestEnvironment();

  ipfs = createIpfsClient(providers.ipfs);

  // deploy wrapper to IPFS
  let { ipfsCid } = await buildAndDeployWrapper({
    wrapperAbsPath: `/path/to/simple-storage`,
    ipfsProvider: providers.ipfs,
    ethereumProvider: providers.ethereum,
    ensName: "simple-storage.eth",
  });

  // get wrapper CID
  const wrapperIpfsCid = ipfsCid;

  // get wrapper IPFS URI
  const wrapperUri = `ipfs/${wrapperIpfsCid}`;

  // initialize client with the ipfs and resolver plugins
  client = new PolywrapClient({
    plugins: [
      {
        uri: "wrap://ens/ipfs.polywrap.eth",
        plugin: ipfsPlugin({
          provider: providers.ipfs,
        }),
      },
      {
        uri: "wrap://ens/ipfs-uri-resolver.polywrap.eth",
        plugin: ipfsResolverPlugin({}),
      },
    ],
  });

  // and query the wrapper at IPFS
  const response = await client.getManifest(wrapperUriENS)

  // we can also resolve the IPFS URI in steps
  // get IPFS URI
  const resolveUriResult = await client.resolveUri(wrapperUri);
  const response' = await resolveUriResult.wrapper?.getManifest(client);

  await stopTestEnvironment();
})
```
For more usage examples see `src/__tests__`.

## API

IPFS Resolver Plugin conforms to a generic UriResolver interface that provides tryResolveUri and getFile methods to the Polywrap client and adds IPFS resolution capability to every client method, e.g. getSchema, getManifest, resolveUri.
