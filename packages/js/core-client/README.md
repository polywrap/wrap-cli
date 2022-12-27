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
/**
 * Core Client configuration that can be passed to the PolywrapClient or PolywrapCoreClient constructors.
 *
 * @remarks
 * Extends CoreClientConfig from @polywrap/core-js.
 * The PolywrapClient and PolywrapCoreClient convert the PolywrapCoreClientConfig to a CoreClientConfig.
 */
export interface PolywrapCoreClientConfig<
  TUri extends Uri | string = Uri | string
> extends CoreClientConfig<TUri> {
  /** configuration for opentelemetry tracing to aid in debugging */
  readonly tracerConfig?: Readonly<Partial<TracerConfig>>;
}
```

## PolywrapCoreClient

### Constructor
```ts
  /**
   * Instantiate a PolywrapClient
   *
   * @param config - a core client configuration
   */
  constructor(config: PolywrapCoreClientConfig) {
```

### getConfig
```ts
  /**
   * Returns the configuration used to instantiate the client
   *
   * @returns an immutable Polywrap client config
   */
  public getConfig(): PolywrapCoreClientConfig<Uri> {
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
  public setTracingEnabled(tracerConfig?: Partial<TracerConfig>): void {
```

### getInterfaces
```ts
  /**
   * returns all interfaces from the configuration used to instantiate the client
   *
   * @returns an array of interfaces and their registered implementations
   */
  @Tracer.traceMethod("PolywrapClient: getInterfaces")
  public getInterfaces(): readonly InterfaceImplementations<Uri>[] | undefined {
```

### getEnvs
```ts
  /**
   * returns all env registrations from the configuration used to instantiate the client
   *
   * @returns an array of env objects containing wrapper environmental variables
   */
  @Tracer.traceMethod("PolywrapClient: getEnvs")
  public getEnvs(): readonly Env<Uri>[] | undefined {
```

### getResolver
```ts
  /**
   * returns the URI resolver from the configuration used to instantiate the client
   *
   * @returns an object that implements the IUriResolver interface
   */
  @Tracer.traceMethod("PolywrapClient: getUriResolver")
  public getResolver(): IUriResolver<unknown> {
```

### getEnvByUri
```ts
  /**
   * returns an env (a set of environmental variables) from the configuration used to instantiate the client
   *
   * @param uri - the URI used to register the env
   * @returns an env, or undefined if an env is not found at the given URI
   */
  @Tracer.traceMethod("PolywrapClient: getEnvByUri")
  public getEnvByUri<TUri extends Uri | string>(
    uri: TUri
  ): Env<Uri> | undefined {
```

### getManifest
```ts
  /**
   * returns a package's wrap manifest
   *
   * @param uri - a wrap URI
   * @returns a Result containing the WrapManifest if the request was successful
   */
  @Tracer.traceMethod("PolywrapClient: getManifest")
  public async getManifest<TUri extends Uri | string>(
    uri: TUri
  ): Promise<Result<WrapManifest, Error>> {
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
  @Tracer.traceMethod("PolywrapClient: getFile")
  public async getFile<TUri extends Uri | string>(
    uri: TUri,
    options: GetFileOptions
  ): Promise<Result<string | Uint8Array, Error>> {
```

### getImplementations
```ts
  /**
   * returns the interface implementations associated with an interface URI
   *  from the configuration used to instantiate the client
   *
   * @param uri - a wrap URI
   * @param options - { applyResolution?: boolean; resolutionContext?: IUriResolutionContext }
   * @returns a Result containing URI array if the request was successful
   */
  @Tracer.traceMethod("PolywrapClient: getImplementations")
  public async getImplementations<TUri extends Uri | string>(
    uri: TUri,
    options: GetImplementationsOptions = {}
  ): Promise<Result<TUri[], Error>> {
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
  @Tracer.traceMethod("PolywrapClient: invokeWrapper")
  public async invokeWrapper<
    TData = unknown,
    TUri extends Uri | string = string
  >(
    options: InvokerOptions<TUri> & { wrapper: Wrapper }
  ): Promise<InvokeResult<TData>> {
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
  @Tracer.traceMethod("PolywrapClient: invoke")
  public async invoke<TData = unknown, TUri extends Uri | string = string>(
    options: InvokerOptions<TUri>
  ): Promise<InvokeResult<TData>> {
```

### tryResolveUri
```ts
  /**
   * Resolve a URI to a wrap package, a wrapper, or a uri
   *
   * @param options - { uri: TUri; resolutionContext?: IUriResolutionContext }
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  @Tracer.traceMethod("PolywrapClient: tryResolveUri", TracingLevel.High)
  public async tryResolveUri<TUri extends Uri | string>(
    options: TryResolveUriOptions<TUri>
  ): Promise<Result<UriPackageOrWrapper, unknown>> {
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
   * @param uri - the Uri to resolve
   * @param resolutionContext? - a resolution context
   * @param options - { noValidate?: boolean }
   * @returns A Promise with a Result containing a Wrapper or Error
   */
  @Tracer.traceMethod("PolywrapClient: loadWrapper", TracingLevel.High)
  public async loadWrapper(
    uri: Uri,
    resolutionContext?: IUriResolutionContext,
    options?: DeserializeManifestOptions
  ): Promise<Result<Wrapper, Error>> {
```

### validate
```ts
  /**
   * Validate a wrapper, given a URI.
   * Optionally, validate the full ABI and/or recursively validate imports.
   *
   * @param uri - the Uri to resolve
   * @param options - { abi?: boolean; recursive?: boolean }
   * @returns A Promise with a Result containing a boolean or Error
   */
  @Tracer.traceMethod("PolywrapClient: validateConfig")
  public async validate<TUri extends Uri | string>(
    uri: TUri,
    options: ValidateOptions
  ): Promise<Result<true, Error>> {
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