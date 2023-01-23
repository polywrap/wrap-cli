# @polywrap/ens-resolver-plugin-js

ENS Resolver Plugin allows the Polywrap JS Client to resolve URIs from the [Ethereum Name Service](https://ens.domains/).

## Usage

``` typescript
import {
  initTestEnvironment,
  providers,
  ensAddresses,
  stopTestEnvironment,
  deployWrapper,
} from "@polywrap/test-env-js";
import { ethereumPlugin, Connections, Connection } from "@polywrap/ethereum-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ensPlugin } from "@polywrap/ens-plugin-js";
import { DeployManifest } from "@polywrap/polywrap-manifest-types-js";

// invoke a wrapper with an ENS path
export async function foo({

  // spin up docker containers with Ganache and IPFS.
  await initTestEnvironment();

  // initialize Ethereum Connections store
  const connections: Connections = new Connections({
    networks: {
      testnet: new Connection({
        provider: providers.ethereum,
      }),
    },
    defaultNetwork: "testnet",
  });

  // initialize the client with eth, ipfs, ens plugins
  client = new PolywrapClient({
    plugins: [
      {
        uri: "wrap://ens/ethereum.polywrap.eth",
        plugin: ethereumPlugin({ connections }),
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
  const wrapperAbsPath = `/path/to/simple-storage`;
  const wrapperEnsDomain = "simple-storage.eth";

  const jobs: DeployManifest["jobs"] = {
    buildAndDeployWrapper: {
      config: {
        provider: providers.ethereum,
        ensRegistryAddress: ensAddresses.ensAddress,
        ensRegistrarAddress: ensAddresses.registrarAddress,
        ensResolverAddress: ensAddresses.resolverAddress,
      },
      steps: [
        {
          name: "registerName",
          package: "ens-recursive-name-register",
          uri: `wrap://ens/${wrapperEnsDomain}`,
        },
        {
          name: "ipfsDeploy",
          package: "ipfs",
          uri: `fs/${wrapperAbsPath}`,
          config: {
            gatewayUri: providers.ipfs,
          },
        },
        {
          name: "ensPublish",
          package: "ens",
          uri: "$$ipfsDeploy",
          config: {
            domainName: wrapperEnsDomain,
          },
        },
      ],
    },
  };
  // deploy a wrapper to IPFS and ENS
  await deployWrapper({
    wrapperAbsPath: wrapperAbsPath,
    jobs,
    build: true,
    codegen: true
  });

  // get ENS URI
  const wrapperUriENS = `ens/testnet/${wrapperEnsDomain}`;

  // invoke the wrapper
  const schemaENS = await client.getManifest(wrapperUriENS)

  // we can also resolve an ENS URI in two steps:
  // 1- get IPFS URI
  const resolveUriResult = await client.resolveUri(wrapperUriEns);
  const wrapperUriIpfs = resolveUriResult.uri
  // 2- invoke the wrapper
  const schemaIPFS = await resolveUriResult.wrapperIPFS?.getManifest(client);

  await stopTestEnvironment();
});
```

For more usage examples see `src/__tests__`.

## API

ENS Resolver Plugin conforms to a generic UriResolver interface that provides a tryResolveUri method to the Polywrap client and adds ENS resolution capability to every client method, e.g. getManifest, resolveUri.
