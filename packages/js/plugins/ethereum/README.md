# @polywrap/ethereum-plugin-js

Ethereum Plugin allows the Polywrap JS Client to interact with the [Ethereum blockchain](https://ethereum.org/).

## Usage

``` typescript
import {
  initTestEnvironment,
  stopTestEnvironment,
  buildWrapper,
  ensAddresses,
  providers
} from "@polywrap/test-env-js";
import { ethereumPlugin, Connections, Connection } from "@polywrap/ethereum-plugin-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ensPlugin } from "@polywrap/ens-plugin-js";

// query a wrapper with an ENS path
export async function foo({

  // spin up docker containers with Ganache and IPFS.
  await initTestEnvironment();

  const ethereumPluginURI = "wrap://ens/ipfs.polywrap.eth"

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
        uri: ethereumPluginURI,
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
          query: {
            addresses: {
              testnet: ensAddresses.ensAddress,
            },
          },
        }),
      },
    ],
  });

  // now the client can query ethereum with the plugin URI
  const signerAddressQuery = await client.invoke<string>({
    ethereumPluginURI,
    method: "getSignerAddress",
  });
  const response = await client.invoke<string>({
    ethereumPluginURI,
    method: "getBalance",
    input: {
      address: signerAddressQuery.data,
    },
  });

  // or instantiate the plugin
  const plugin = ethereumPlugin({ connections });

  // and send invocations to ethereum
  const signerAddressQuery' = plugin.getSignerAddress(client)
  const response' = plugin.getBalance({address: signerAddressQuery.data}, client)

  await stopTestEnvironment();
})

```

For more usage examples see `src/__tests__`.

## API

Full API in `src/schema.graphql`
