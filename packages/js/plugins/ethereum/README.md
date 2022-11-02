# @polywrap/ethereum-plugin-js

The Ethereum plugin wrapper allows the Polywrap JS Client to interact with any [EVM based blockchain](https://ethereum.org/).

## Usage

``` typescript
import {
  ethereumPlugin,
  Connections,
  Connection
} from "@polywrap/ethereum-plugin-js";

export async function main() {

  const uri = "wrap://ens/ethereum.polywrap.eth"

  // initialize Ethereum Connections store
  const connections: Connections = new Connections({
    networks: {
      mainnet: new Connection({
        provider: "..."
      }),
      matic: new Connection({
        provider: window.ethereum
      })
    },
    defaultNetwork: "matic"
  });

  // initialize the client with the ethereum plugin
  client = new PolywrapClient({
    plugins: [
      {
        uri: uri,
        plugin: ethereumPlugin({ connections })
      }
    ]
  });

  // now you can invoke the ethereum plugin by its URI
  // NOTE: uses default network "matic"
  const getSignerAddress = await client.invoke<string>({
    uri,
    method: "getSignerAddress",
  });

  if (!getSignerAddress.ok) throw getSignerAddress.error;

  const address = getSignerAddress.value;

  // Get a balance from mainnet, by passing in the optional
  // "connection" argument.
  const getBalance = await client.invoke<string>({
    uri,
    method: "getBalance",
    args: {
      address: "0x...",
      connection: {
        networkNameOrChainId: "mainnet"
      }
    },
  });

  if (!getBalance.ok) throw getBalance.error;

  const balance = getBalance.value;

  console.log("Matic Signer: ", address);
  console.log("Mainnet Balance: ", balance);
}
```

For more usage examples see `src/__tests__`.

## API

Full API in `src/schema.graphql`
