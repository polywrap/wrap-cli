# @polywrap/http-resolver-plugin-js

HTTP Resolver Plugin allows the Polywrap JS Client to resolve wrapper URIs using HTTP/S.

## Usage

``` typescript
import { PolywrapClient } from "@polywrap/client-js";
import {
  initTestEnvironment,
  providers,
  stopTestEnvironment,
  deployWrapper,
} from "@polywrap/test-env-js";
import { httpResolverPlugin } from "@polywrap/http-resolver-plugin-js";
import { DeployManifest } from "@polywrap/polywrap-manifest-types-js";

// invoke wrapper at HTTP URI
export async function foo({

  await initTestEnvironment();
  const wrapperAbsPath = `/path/to/simple-storage`;
  const wrapperHttpUri = `${providers.http}/wrappers/local/simple-storage`;

  const jobs: DeployManifest["jobs"] = {
    buildAndDeployWrapperToHttp: {
      steps: [
        {
          name: "httpDeploy",
          package: "http",
          uri: `fs/${wrapperAbsPath}`,
          config: {
            postUrl: wrapperHttpUri,
          },
        },
      ],
    },
  };
  // deploy wrapper to local HTTP server
  await deployWrapper({
    wrapperAbsPath: `/path/to/simple-storage`,
    jobs,
    build: true,
    codegen: true,
  });

  // get wrapper HTTP URI
  const wrapperUri = `http/${wrapperHttpUri}`;

  // initialize client with the HTTP Resolver plugin
  client = new PolywrapClient({
    plugins: [
      {
        uri: "wrap://ens/http-uri-resolver.polywrap.eth",
        plugin: httpResolverPlugin({}),
      },
    ],
    interfaces: [
      {
        interface: new Uri("wrap://ens/uri-resolver.core.polywrap.eth"),
        implementations: [
          new Uri("wrap://ens/http-resolver.polywrap.eth"),
        ],
      }
    ]
  });

  // invoke query the wrapper over HTTP
  const response = await client.getManifest(wrapperUri)

  // we can resolve the HTTP URI in steps
  const resolveUriResult = await client.resolveUri(wrapperUri);
  const response' = await resolveUriResult.wrapper?.getManifest(client);

  await stopTestEnvironment();
})
```
For more usage examples see `src/__tests__`.

## API

HTTP Resolver Plugin conforms to a generic UriResolver interface that provides tryResolveUri and getFile methods to the Polywrap client and adds HTTP resolution capability to every client method, e.g. getManifest, resolveUri.
