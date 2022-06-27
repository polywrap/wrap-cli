# ENS Plugin (@polywrap/ens-plugin-js)

ENS Plugin allows the Polywrap JS Client to resolve URIs from the [Ethereum Name Service](https://ens.domains/).

# Usage

``` typescript
import {
  initTestEnvironment,
  providers,
  ensAddresses,
  stopTestEnvironment,
  buildAndDeployWrapper,
} from "@polywrap/test-env-js";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ensPlugin } from "@polywrap/ens-plugin-js";

// query a wrapper with an ENS path
export async function foo({

  // spin up docker containers with Ganache and IPFS.
  await initTestEnvironment();

  // initialize the client with eth, ipfs, ens plugins
  client = new PolywrapClient({
    plugins: [
      {
        uri: "wrap://ens/ethereum.polywrap.eth",
        plugin: ethereumPlugin({
          networks: {
            testnet: {
              provider: providers.ethereum,
            },
          },
          defaultNetwork: "testnet",
        }),
      },
      {
        uri: "wrap://ens/ipfs.polywrap.eth",
        plugin: ipfsPlugin({
          provider: providers.ipfs,
          fallbackProviders: defaultIpfsProviders,
        }),
      },
      {
        uri: "wrap://ens/ens.polywrap.eth",
        plugin: ensPlugin({
          addresses: {
            testnet: ensAddresses.ensAddress,
          },
        }),
      },
    ],
  });

  // get filesystem path
  const wrapperAbsPath = `${GetPathToTestWrappers()}/wasm-as/simple-storage`;

  // deploy a wrapper to IPFS
  let { ensDomain } = await buildAndDeployWrapper({
    wrapperAbsPath: wrapperAbsPath,
    ipfsProvider: providers.ipfs,
    ethereumProvider: providers.ethereum,
    ensName: "simple-storage.eth",
  });

  // get ENS URI
  const wrapperUriENS = `ens/testnet/${wrapperEnsDomain}`;

  // query the wrapper
  const schemaENS = await client.getSchema(wrapperUriENS)

  // we can also resolve an ENS URI in two steps
  // get IPFS URI
  const resolveUriResult = await client.resolveUri(wrapperUriEns);
  const wrapperUriIpfs = resolveUriResult.uri

  // query the wrapper
  const schemaIPFS = await resolveUriResult.wrapperIPFS?.getSchema(client);

  await stopTestEnvironment();
});
```

For more usage examples see `src/__tests__`.

# API

ENS Plugin conforms to a generic UriResolver interface that provides a tryResolveUri method to the Polywrap client and adds ENS resolution capability to every client method, e.g. getSchema, getManifest, resolveUri.
