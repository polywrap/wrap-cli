# @polywrap/uts46-plugin-js

UTS46 Plugin allows Polywrap JS Client to handle internationalized domain names (IDNA), with a full mapping between Unicode and Punycode defined by [UTS #46](https://unicode.org/reports/tr46/).

## Usage

``` typescript
import { PolywrapClient } from "@polywrap/client-js";
import { uts46Plugin } from "@polywrap/uts46-plugin-js";

export async function foo({

  const uts46PluginUri = "wrap://ens/uts46.polywrap.eth";

  const client = new PolywrapClient({
    plugins: [
      {
        uri: uts46PluginUri,
        plugin: uts46Plugin({}),
      },
    ]
  });

  const response = await client.invoke<string>({
    uri: uts46PluginUri,
    method: 'toAscii',
    args: {
      value: "xn-bb-eka.at"
    }
  });
})
```

## API

Full API in `src/schema.graphql`
