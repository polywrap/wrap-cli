# @polywrap/client-js
<a href="https://www.npmjs.com/package/@polywrap/client-js" target="_blank" rel="noopener noreferrer">
<img src="https://img.shields.io/npm/v/@polywrap/client-js.svg" alt="npm"/>
</a>

<br/>
<br/>
The Polywrap client extends the PolywrapCoreClient to provide UX features, such as an additional constructor and additional configuration options.

## Installation

```bash
npm install --save @polywrap/client-js
```

## Usage

### Instantiate the client
```ts
import { PolywrapClient } from "@polywrap/client-js";

const client = new PolywrapClient();
```

### Invoke a wrapper

```ts
await client.invoke({
  uri: "ens/helloworld.dev.polywrap.eth",
  method: "logMessage",
  args: {
    message: "Hello World!"
  }
});
```

### Configure the client

```ts
const config = {
  // redirect invocations from one uri to another
  redirects: [
    {
      from: "wrap://ens/from.eth",
      to: "wrap://ens/to.eth",
    }
  ],
  // add embedded Wasm wrappers
  wrappers: [
    {
      uri: "wrap://fs/simple/wrapper/uri/build",
      wrapper: WasmWrapper.from(
        fs.readFileSync(path.join(simpleWrapperPath, "build/wrap.info")), 
        fs.readFileSync(path.join(simpleWrapperPath, "build/wrap.wasm"))
      )
    }
  ],
  // add and configure embedded plugin wrappers
  packages: [
    {
      uri: "wrap://ens/ipfs.polywrap.eth",
      package: ipfsPlugin({}),
    },
  ],
  // declare interface implementations
  interfaces: [
    {
      interface: "wrap://ens/uri-resolver.core.polywrap.eth",
      implementations: [
        "wrap://ens/ipfs-resolver.polywrap.eth",
      ],
    },
  ],
  // set environmental variables for a wrapper
  envs: [
    {
      uri: "wrap://ens/ipfs.polywrap.eth",
      env: {
        provider: "https://ipfs.wrappers.io",
      },
    },
  ],
  // customize URI resolution
  resolvers: [
    new RecursiveResolver(
      new PackageToWrapperCacheResolver(wrapperCache, [
        new ExtendableUriResolver(),
      ])
    )
  ],

  // custom wrapper cache
  wrapperCache: new WrapperCache(),
  
  // tracer configuration - see @polywrap/tracing-js package
  tracerConfig: { ... },
};
```
```ts
// create a client by modifying the default configuration bundle
const client = new PolywrapClient(config);

// or remove and replace the default configuration
const altClient = new PolywrapClient(config, { noDefaults: true });
```

## Reference

### Constructor
```ts
/**
 * Instantiate a PolywrapClient
 *
 * @param config - a whole or partial client configuration
 * @param options - { noDefaults?: boolean }
 */
constructor(config?: Partial<PolywrapClientConfig>, options?: {
  noDefaults?: false;
});
constructor(config: PolywrapCoreClientConfig, options: {
  noDefaults: true;
});
```