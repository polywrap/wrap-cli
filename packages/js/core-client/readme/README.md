# @polywrap/core-client-js
<a href="https://www.npmjs.com/package/@polywrap/core-client-js" target="_blank" rel="noopener noreferrer">
<img src="https://img.shields.io/npm/v/@polywrap/core-client-js.svg" alt="npm"/>
</a>

<br/>
<br/>
The Polywrap JavaScript core client invokes wrapper functions. It's designed to run in any environment that can execute JavaScript (think websites, node scripts, etc.). It has TypeScript support.

## Installation

```bash
npm install --save @polywrap/core-client-js
```

## Usage

### Instantiate the client
```ts
import { PolywrapCoreClient } from "@polywrap/core-client-js";

const config = { ... };
const client = new PolywrapCoreClient(config);
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

### Configure the core client

```ts
const config = {
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
  // customize URI resolution by adding redirects and embedded wrappers/packages
  resolver:
    RecursiveResolver.from(
      PackageToWrapperCacheResolver.from(
        [
          StaticResolver.from([
            ...redirects,
            ...wrappers,
            ...packages,
          ]),
          ...this.config.resolvers,
          new ExtendableUriResolver(),
        ],
        new WrapperCache()
      )
    ),
  // tracer configuration - see @polywrap/tracing-js package
  tracerConfig: { ... },
};
```
```ts
// create a client by modifying the default configuration bundle
const client = new PolywrapCoreClient(config);
```

## Types

```ts
$snippet: PolywrapCoreClientConfig
```

## PolywrapCoreClient

### Constructor
```ts
$snippet: PolywrapCoreClient-constructor
```

### getConfig
```ts
$snippet: PolywrapCoreClient-getConfig
```

### setTracingEnabled
```ts
$snippet: PolywrapCoreClient-setTracingEnabled
```

### getInterfaces
```ts
$snippet: PolywrapCoreClient-getInterfaces
```

### getEnvs
```ts
$snippet: PolywrapCoreClient-getEnvs
```

### getResolver
```ts
$snippet: PolywrapCoreClient-getResolver
```

### getEnvByUri
```ts
$snippet: PolywrapCoreClient-getEnvByUri
```

### getManifest
```ts
$snippet: PolywrapCoreClient-getManifest
```

### getFile
```ts
$snippet: PolywrapCoreClient-getFile
```

### getImplementations
```ts
$snippet: PolywrapCoreClient-getImplementations
```

### invokeWrapper
```ts
$snippet: PolywrapCoreClient-invokeWrapper
```

### invoke
```ts
$snippet: PolywrapCoreClient-invoke
```

### tryResolveUri
```ts
$snippet: PolywrapCoreClient-tryResolveUri
```

### loadWrapper
```ts
$snippet: PolywrapCoreClient-loadWrapper
```

### validate
```ts
$snippet: PolywrapCoreClient-validate
```

## Development

The Polywrap JavaScript client is open-source. It lives within the [Polywrap toolchain monorepo](https://github.com/polywrap/toolchain/tree/origin/packages/js/client). Contributions from the community are welcomed!

### Build
```bash
nvm use && yarn install && yarn build
```

### Test
```bash
yarn test
``