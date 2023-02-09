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

### Instantiate

Use the `@polywrap/client-config-builder-js` package to build a CoreClientConfig for your project, then use the PolywrapCoreClient [constructor](#constructor) to instantiate the client with your config.

```ts
  const config = new ClientConfigBuilder().addDefaults().build();

  const client = new PolywrapCoreClient(config);
```

### Invoke

Invoke a wrapper.

```ts
  const result = await client.invoke({
    uri: Uri.from("ens/helloworld.dev.polywrap.eth"),
    method: "logMessage",
    args: {
      message: "Hello World!"
    }
  });

  if (!result.ok) throw result.error;

  const value = result.value;
```

# Reference

## PolywrapCoreClient

### Constructor
```ts
  /**
   * Instantiate a PolywrapClient
   *
   * @param config - a core client configuration
   */
  constructor(private _config: CoreClientConfig) 
```

### getConfig
```ts
  /**
   * Returns the configuration used to instantiate the client
   *
   * @returns an immutable Polywrap client config
   */
  public getConfig(): CoreClientConfig 
```

### getInterfaces
```ts
  /**
   * returns all interfaces from the configuration used to instantiate the client
   *
   * @returns an array of interfaces and their registered implementations
   */
  public getInterfaces():
    | readonly InterfaceImplementations[]
    | undefined 
```

### getEnvs
```ts
  /**
   * returns all env registrations from the configuration used to instantiate the client
   *
   * @returns an array of env objects containing wrapper environmental variables
   */
  public getEnvs(): readonly Env[] | undefined 
```

### getResolver
```ts
  /**
   * returns the URI resolver from the configuration used to instantiate the client
   *
   * @returns an object that implements the IUriResolver interface
   */
  public getResolver(): IUriResolver<unknown> 
```

### getEnvByUri
```ts
  /**
   * returns an env (a set of environmental variables) from the configuration used to instantiate the client
   *
   * @param uri - the URI used to register the env
   * @returns an env, or undefined if an env is not found at the given URI
   */
  public getEnvByUri(uri: Uri): Env | undefined 
```

### getManifest
```ts
  /**
   * returns a package's wrap manifest
   *
   * @param uri - a wrap URI
   * @returns a Result containing the WrapManifest if the request was successful
   */
  public async getManifest(
    uri: Uri
  ): Promise<Result<WrapManifest, WrapError>> 
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
  public async getFile(
    uri: Uri,
    options: GetFileOptions
  ): Promise<Result<string | Uint8Array, WrapError>> 
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
  public async getImplementations(
    uri: Uri,
    options: GetImplementationsOptions = {}
  ): Promise<Result<Uri[], WrapError>> 
```

### invokeWrapper
```ts
  /**
   * Invoke a wrapper using an instance of the wrapper.
   *
   * @param options - {
   *   // The Wrapper's URI
   *   uri: TUri;
   *
   *   // Method to be executed.
   *   method: string;
   *
   *   //Arguments for the method, structured as a map, removing the chance of incorrectly ordered arguments.
   *    args?: Record<string, unknown> | Uint8Array;
   *
   *   // Env variables for the wrapper invocation.
   *    env?: Record<string, unknown>;
   *
   *   // A Uri resolution context
   *   resolutionContext?: IUriResolutionContext;
   *
   *   // if true, return value is a msgpack-encoded byte array
   *   encodeResult?: boolean;
   *
   *   // The wrapper to invoke
   *   wrapper: Wrapper
   * }
   * @returns A Promise with a Result containing the return value or an error
   */
  public async invokeWrapper<TData = unknown>(
    options: InvokerOptions & { wrapper: Wrapper }
  ): Promise<InvokeResult<TData>> 
```

### invoke
```ts
  /**
   * Invoke a wrapper.
   *
   * @remarks
   * Unlike `invokeWrapper`, this method automatically retrieves and caches the wrapper.
   *
   * @param options - {
   *   // The Wrapper's URI
   *   uri: TUri;
   *
   *   // Method to be executed.
   *   method: string;
   *
   *   //Arguments for the method, structured as a map, removing the chance of incorrectly ordered arguments.
   *    args?: Record<string, unknown> | Uint8Array;
   *
   *   // Env variables for the wrapper invocation.
   *    env?: Record<string, unknown>;
   *
   *   // A Uri resolution context
   *   resolutionContext?: IUriResolutionContext;
   *
   *   // if true, return value is a msgpack-encoded byte array
   *   encodeResult?: boolean;
   * }
   * @returns A Promise with a Result containing the return value or an error
   */
  public async invoke<TData = unknown>(
    options: InvokerOptions
  ): Promise<InvokeResult<TData>> 
```

### tryResolveUri
```ts
  /**
   * Resolve a URI to a wrap package, a wrapper, or a uri
   *
   * @param options - { uri: TUri; resolutionContext?: IUriResolutionContext }
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  public async tryResolveUri(
    options: TryResolveUriOptions
  ): Promise<Result<UriPackageOrWrapper, unknown>> 
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
  public async loadWrapper(
    uri: Uri,
    resolutionContext?: IUriResolutionContext,
    options?: DeserializeManifestOptions
  ): Promise<Result<Wrapper, WrapError>> 
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