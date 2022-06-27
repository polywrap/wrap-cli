# IPFS Plugin (@polywrap/ipfs-plugin-js)

IPFS Plugin allows the Polywrap JS Client to interact with [IPFS](https://ipfs.io/).

# Usage

``` typescript
import { PolywrapClient } from "@polywrap/client-js";
import {
  initTestEnvironment,
  providers,
  stopTestEnvironment,
} from "@polywrap/test-env-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";

const createIpfsClient = require("@dorgjelli-test/ipfs-http-client-lite");

// query IPFS
export async function foo({

  await initTestEnvironment();

  const ipfsPluginUri = "wrap://ens/ipfs.polywrap.eth";

  ipfs = createIpfsClient(providers.ipfs);
  const sampleFileTextContents = "Hello World!";
  const sampleFileBuffer = Buffer.from(sampleFileTextContents, "utf-8");
  let ipfsAddResult = await ipfs.add(sampleFileBuffer);

  // initialize client with the ipfs plugin
  client = new PolywrapClient({
    plugins: [
      {
        uri: ipfsPluginUri,
        plugin: ipfsPlugin({
          provider: providers.ipfs,
        }),
      },
    ],
  });

  // and query ipfs
  const response = await client.invoke<string>({
    ipfsPluginUri,
    method: "cat",
    input: {
      cid: sampleFileIpfsInfo.hash.toString(),
    },
  });

  // or instantiate the plugin
  const plugin = ipfsPlugin({
    provider: providers.ipfs,
  });

  // and query ipfs
  const response' = await plugin.cat(
    { cid: sampleFileIpfsInfo.hash.toString() },
    client
  );

  await stopTestEnvironment();
})
```

For more usage examples see `src/__tests__`.

# API

Full API in `src/schema.graphql`
