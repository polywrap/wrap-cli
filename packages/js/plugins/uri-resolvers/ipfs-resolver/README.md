# @polywrap/ipfs-resolver-plugin-js

IPFS Resolver Plugin allows the Polywrap JS Client to resolve wrapper URIs from IPFS.

## Usage

``` typescript
import { PolywrapClient } from "@polywrap/client-js";
import {
  initTestEnvironment,
  providers,
  stopTestEnvironment,
  deployWrapper,
} from "@polywrap/test-env-js";
import { DeployManifest } from "@polywrap/polywrap-manifest-types-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ipfsResolverPlugin } from "@polywrap/ipfs-resolver-plugin-js";
import createIpfsClient from "@polywrap/ipfs-http-client-lite";

// invoke wrapper at IPFS path
export async function foo({

  await initTestEnvironment();
  const wrapperAbsPath = `/path/to/simple-storage`;

  ipfs = createIpfsClient(providers.ipfs);

  const jobs: DeployManifest["jobs"] = {
    buildAndDeployWrapper: {
      config: {
        provider: providers.ethereum
      },
      steps: [
        {
          name: "ipfsDeploy",
          package: "ipfs",
          uri: `fs/${wrapperAbsPath}`,
          config: {
            gatewayUri: providers.ipfs,
          },
        },
      ],
    },
  };

  // deploy wrapper to IPFS
  const response = await deployWrapper({
    wrapperAbsPath,
    jobs,
    build: true,
    codegen: true,
  });

  if (!response) {
    throw Error("Failed to deploy wrapper");
  }


  // get wrapper CID
  const extractCID = /(wrap:\/\/ipfs\/[A-Za-z0-9]+)/;
  const result = response.stdout.match(extractCID);
  const wrapperIpfsCid = new Uri(result![1]).path;

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

  // and invoke the wrapper at IPFS
  const response = await client.getManifest(wrapperUriENS)

  // we can also resolve the IPFS URI in steps
  // get IPFS URI
  const resolveUriResult = await client.resolveUri(wrapperUri);
  const response = await resolveUriResult.wrapper?.getManifest(client);

  await stopTestEnvironment();
})
```
For more usage examples see `src/__tests__`.

## API

IPFS Resolver Plugin conforms to a generic UriResolver interface that provides tryResolveUri and getFile methods to the Polywrap client and adds IPFS resolution capability to every client method, e.g. getManifest, resolveUri.
