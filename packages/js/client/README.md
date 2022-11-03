# @polywrap/client-js
<a href="https://www.npmjs.com/package/@polywrap/client-js" target="_blank" rel="noopener noreferrer">
<img src="https://img.shields.io/npm/v/@polywrap/client-js.svg" alt="npm"/>
</a>

<br/>
<br/>
The Polywrap JavaScript client invokes functions of wrappers and plugins. It's designed to run in any environment that can execute JavaScript (think websites, node scripts, etc.). It has TypeScript support.

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
  uri: "ens/rinkeby/helloworld.dev.polywrap.eth",
  method: "logMessage",
  args: {
    message: "Hello World!"
  }
});
```

### Configure the client

```ts
const config = {
  // redirect queries from one uri to another
  redirects: [
    {
      from: "wrap://ens/from.eth",
      to: "wrap://ens/to.eth",
    }
  ],
  // declare and configure plugin wrappers
  plugins: [
    {
      uri: "wrap://ens/ipfs.polywrap.eth",
      plugin: ipfsPlugin({}),
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
  
  // ADVANCED USAGE:
  
  // customize URI resolution
  resolver: new RecursiveResolver(
    new PackageToWrapperCacheResolver(wrapperCache, [
      new ExtendableUriResolver(),
    ])
  ),

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
constructor(config?: Partial<PolywrapClientConfig<string | Uri>>, options?: {
  noDefaults?: boolean;
});
```

### getConfig
```ts
/**
 * Returns the configuration used to instantiate the client
 *
 * @returns an immutable Polywrap client config
 */
getConfig(): PolywrapCoreClientConfig<Uri>;
```

### setTracingEnabled
```ts
/**
 * Enable tracing for intricate debugging
 *
 * @remarks
 * Tracing uses the @polywrap/tracing-js package
 *
 * @param tracerConfig - configure options such as the tracing level
 * @returns void
 */
setTracingEnabled(tracerConfig?: Partial<TracerConfig>): void;
```

### getInterfaces
```ts
/**
 * returns all interfaces from the configuration used to instantiate the client
 *
 * @returns an array of interfaces and their registered implementations
 */
getInterfaces(): readonly InterfaceImplementations<Uri>[];
```

### getEnvs
```ts
/**
 * returns all env registrations from the configuration used to instantiate the client
 *
 * @returns an array of env objects containing wrapper environmental variables
 */
getEnvs(): readonly Env<Uri>[];
```

### getResolver
```ts
/**
 * returns the URI resolver from the configuration used to instantiate the client
 *
 * @returns an object that implements the IUriResolver interface
 */
getResolver(): IUriResolver<unknown>;
```

### getEnvByUri
```ts
/**
 * returns an env (a set of environmental variables) from the configuration used to instantiate the client
 *
 * @param uri - the URI used to register the env
 * @returns an env, or undefined if an env is not found at the given URI
 */
getEnvByUri<TUri extends Uri | string>(uri: TUri): Env<Uri> | undefined;
```

### getManifest
```ts
/**
 * returns a package's wrap manifest
 *
 * @param uri - a wrap URI
 * @param options - { noValidate?: boolean }
 * @returns a Result containing the WrapManifest if the request was successful
 */
getManifest<TUri extends Uri | string>(uri: TUri, options?: GetManifestOptions): Promise<Result<WrapManifest, Error>>;
```

### getFile
```ts
/**
 * returns a file contained in a wrap package
 *
 * @param uri - a wrap URI
 * @param options - { path: string; encoding?: "utf-8" | string }
 * @returns a Promise of a Result containing a file if the request was successful
 */
getFile<TUri extends Uri | string>(uri: TUri, options: GetFileOptions): Promise<Result<string | Uint8Array, Error>>;
```

### getImplementations
```ts
/**
 * returns the interface implementations associated with an interface URI
 *  from the configuration used to instantiate the client
 *
 * @param uri - a wrap URI
 * @param options - { applyResolution?: boolean }
 * @returns a Result containing URI array if the request was successful
 */
getImplementations<TUri extends Uri | string>(uri: TUri, options?: GetImplementationsOptions): Result<TUri[], Error>;
```

### query
```ts
/**
 * Invoke a wrapper using GraphQL query syntax
 *
 * @remarks
 * This method behaves similar to the invoke method and allows parallel requests,
 * but the syntax is more verbose. If the query is successful, data will be returned
 * and the `error` value of the returned object will be undefined. If the query fails,
 * the data property will be undefined and the error property will be populated.
 *
 * @param options - {
 *   // The Wrapper's URI
 *   uri: TUri;
 *
 *   // The GraphQL query to parse and execute, leading to one or more Wrapper invocations.
 *   query: string | QueryDocument;
 *
 *   // Variables referenced within the query string via GraphQL's '$variable' syntax.
 *   variables?: TVariables;
 * }
 *
 * @returns A Promise containing an object with either the data or an error
 */
query<TData extends Record<string, unknown> = Record<string, unknown>, TVariables extends Record<string, unknown> = Record<string, unknown>, TUri extends Uri | string = string>(options: QueryOptions<TVariables, TUri>): Promise<QueryResult<TData>>;
```

### invokeWrapper
```ts
/**
 * Invoke a wrapper using standard syntax and an instance of the wrapper
 *
 * @param options - {
 *   // The Wrapper's URI
 *   uri: TUri;
 *
 *   // Method to be executed.
 *   method: string;
 *
 *   //Arguments for the method, structured as a map, removing the chance of incorrectly ordering arguments.
 *    args?: Record<string, unknown> | Uint8Array;
 *
 *   // Env variables for the wrapper invocation.
 *    env?: Record<string, unknown>;
 *
 *   resolutionContext?: IUriResolutionContext;
 *
 *   // if true, return value is a msgpack-encoded byte array
 *   encodeResult?: boolean;
 * }
 *
 * @returns A Promise with a Result containing the return value or an error
 */
invokeWrapper<TData = unknown, TUri extends Uri | string = string>(options: InvokerOptions<TUri> & {
    wrapper: Wrapper;
}): Promise<InvokeResult<TData>>;
```

### invoke
```ts
/**
 * Invoke a wrapper using standard syntax.
 * Unlike `invokeWrapper`, this method automatically retrieves and caches the wrapper.
 *
 * @param options - {
 *   // The Wrapper's URI
 *   uri: TUri;
 *
 *   // Method to be executed.
 *   method: string;
 *
 *   //Arguments for the method, structured as a map, removing the chance of incorrectly ordering arguments.
 *    args?: Record<string, unknown> | Uint8Array;
 *
 *   // Env variables for the wrapper invocation.
 *    env?: Record<string, unknown>;
 *
 *   resolutionContext?: IUriResolutionContext;
 *
 *   // if true, return value is a msgpack-encoded byte array
 *   encodeResult?: boolean;
 * }
 *
 * @returns A Promise with a Result containing the return value or an error
 */
invoke<TData = unknown, TUri extends Uri | string = string>(options: InvokerOptions<TUri>): Promise<InvokeResult<TData>>;
```

### subscribe
```ts
/**
 * Invoke a wrapper at a regular frequency (within ~16ms)
 *
 * @param options - {
 *   // The Wrapper's URI
 *   uri: TUri;
 *
 *   // Method to be executed.
 *   method: string;
 *
 *   //Arguments for the method, structured as a map, removing the chance of incorrectly ordering arguments.
 *    args?: Record<string, unknown> | Uint8Array;
 *
 *   // Env variables for the wrapper invocation.
 *    env?: Record<string, unknown>;
 *
 *   resolutionContext?: IUriResolutionContext;
 *
 *   // if true, return value is a msgpack-encoded byte array
 *   encodeResult?: boolean;
 *
 *   // the frequency at which to perform the invocation
 *   frequency?: {
 *     ms?: number;
 *     sec?: number;
 *     min?: number;
 *     hours?: number;
 *   }
 * }
 *
 * @returns A Promise with a Result containing the return value or an error
 */
subscribe<TData = unknown, TUri extends Uri | string = string>(options: SubscribeOptions<TUri>): Subscription<TData>;
```

### tryResolveUri
```ts
/**
 * Resolve a URI to a wrap package, a wrapper, or a uri
 *
 * @param options - { uri: TUri; resolutionContext?: IUriResolutionContext }
 * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
 */
tryResolveUri<TUri extends Uri | string>(options: TryResolveUriOptions<TUri>): Promise<Result<UriPackageOrWrapper, unknown>>;
```

### loadWrapper
```ts
/**
 * Resolve a URI to a wrap package or wrapper.
 * If the URI resolves to wrap package, load the wrapper.
 *
 * @remarks
 * Unlike other methods, `loadWrapper` does not accept a string URI.
 * You can create a Uri (from the `@polywrap/core-js` package) using `Uri.from("wrap://...")`
 *
 * @param uri: the Uri to resolve
 * @param resolutionContext? a resolution context
 * @param options - { noValidate?: boolean }
 * @returns A Promise with a Result containing either a wrapper if successful
 */
loadWrapper(uri: Uri, resolutionContext?: IUriResolutionContext, options?: DeserializeManifestOptions): Promise<Result<Wrapper, Error>>;
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
```