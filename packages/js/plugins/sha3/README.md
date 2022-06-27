# SHA3 Plugin (@polywrap/sha3-plugin-js)

SHA3 Plugin provides the Polywrap JS Client with SHA-3 / Keccak / Shake hash functions.

# Usage

``` typescript
import { PolywrapClient } from "@polywrap/client-js"
import { sha3Plugin } from "@polywrap/sha3-plugin-js";

export async function foo({

  const sha3PluginUri = "wrap://ens/sha3.polywrap.eth";

  const client = new PolywrapClient({
    plugins: [
      {
        uri: sha3PluginUri,
        plugin: sha3Plugin({}),
      },
    ]
  });

  const response = await client.query<{ sha3_512: string }>({
    uri: sha3PluginUri,
    query: `
      query {
        sha3_512(message: "test message to hash")
      }
    `,
  });
})
```

# API

Full API in `src/schema.graphql`
