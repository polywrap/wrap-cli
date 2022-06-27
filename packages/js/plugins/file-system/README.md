# Filesystem Plugin (@polywrap/fs-plugin-js)

Filesystem Plugin allows the Polywrap JS Client to interact with the local filesystem.

# Usage

``` typescript
import { PolywrapClient } from "@polywrap/client-js";
import { filesystemPlugin } from "@polywrap/fs-plugin-js";

// query a local wrapper
export async function foo({

  const filesystemPluginUri = "wrap://ens/fs.polywrap.eth";

  // initialize the client with eth, ipfs, ens plugins
  client = new PolywrapClient({
    plugins: [
      {
        uri: filesystemPluginUri,
        plugin: fileSystemPlugin({}),
      },
    ],
  });

  const sampleFilePath = path.resolve(__dirname, "samples/sample.txt");

  // and read from filesystem
  const response = await client.invoke<string>({
    filesystemPluginUri,
    method: "readFile",
    input: {
      path: sampleFilePath,
    },
  });

  // or instantiate the plugin
  const plugin = filesystemPlugin({});

  // and read from filesystem
  const response' = await plugin.readFile(
    { path: sampleFilePath, },
    client
  );
});
```

For more usage examples see `src/__tests__`.

# API

 - readFile
 - readFileAsString
 - writeFile
 - exists
 - mkdir
 - rm
 - rmdir
