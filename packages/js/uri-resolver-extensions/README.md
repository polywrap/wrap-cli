# @polywrap/uri-resolver-extensions-js
<a href="https://www.npmjs.com/package/@polywrap/uri-resolver-extensions-js" target="_blank" rel="noopener noreferrer">
<img src="https://img.shields.io/npm/v/@polywrap/uri-resolver-extensions-js.svg" alt="npm"/>
</a>

<br/>
<br/>
Polywrap URI resolver extensions to customize resolution in the Polywrap Client.

## Installation

```bash
npm install --save @polywrap/uri-resolver-extensions-js
```

## Usage

If you build a configuration for the Polywrap client using the `ClientConfigBuilder` in the `@polywrap/client-config-builder-js` package, the `ExtendableUriResovler` is included by default. In that case you only need to register implementations of the URI Resolver Extension interface.

Otherwise, you must also add the `ExtendableUriResolver` to your resolver.

```ts
  const clientConfig: CoreClientConfig = {
    interfaces: [
      {
        interface: Uri.from("wrap://ens/uri-resolver.core.polywrap.eth"),
        implementations: [
          Uri.from("wrap://ens/fs-resolver.polywrap.eth"),
          Uri.from("wrap://ens/ipfs-resolver.polywrap.eth"),
          Uri.from("wrap://ens/ens-resolver.polywrap.eth")
        ]
      }
    ],
    resolver: RecursiveResolver.from(
      [
        StaticResolver.from([
          ...redirects,
          ...wrappers,
          ...packages,
        ]),
        new ExtendableUriResolver(),
      ]
    )
  };
```

# Reference

## ExtendableUriResolver

```ts
/**
 * A Uri Resolver that delegates resolution to wrappers implementing the
 * URI Resolver Extension Interface.
 * */
export class ExtendableUriResolver extends UriResolverAggregatorBase<
  Error,
  Error
> 
```

### Properties

#### extInterfaceUri (static)
```ts
  /** The supported interface URIs to which resolver-ext implementations should be registered */
  public static defaultExtInterfaceUris: Uri[] = [
    Uri.from("wrap://ens/wraps.eth:uri-resolver-ext@1.1.0"),
    Uri.from("wrap://ens/wraps.eth:uri-resolver-ext@1.0.0"),
  ];
```

#### extInterfaceUri
```ts
  /** The active interface URIs to which implementations should be registered */
  public readonly extInterfaceUris: Uri[];
```

### constructor
```ts
  /**
   * Create an ExtendableUriResolver
   *
   * @param extInterfaceUris - URI Resolver Interface URIs
   * @param resolverName - Name to use in resolution history output
   * */
  constructor(
    extInterfaceUris: Uri[] = ExtendableUriResolver.defaultExtInterfaceUris,
    resolverName = "ExtendableUriResolver"
  ) 
```

### Methods

#### getUriResolvers
```ts
  /**
   * Get a list of URI Resolvers
   *
   * @param uri - the URI to query for resolvers
   * @param client - a CoreClient instance that can be used to make an invocation
   * @param resolutionContext - the current URI resolution context
   *
   * @returns a list of IUriResolver or an error
   * */
  async getUriResolvers(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<IUriResolver<unknown>[], Error>> 
```

#### tryResolverUri
```ts
  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   * Attempts resolution with each the URI Resolver Extension wrappers sequentially.
   *
   * @param uri - the URI to resolve
   * @param client - a CoreClient instance that may be used to invoke a wrapper that implements the UriResolver interface
   * @param resolutionContext - the current URI resolution context
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  async tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, Error>> 
```

#### getStepDescription (protected)
```ts
  /**
   * A utility function for generating step descriptions to facilitate resolution context updates
   *
   * @returns text describing the URI resolution step
   * */
  protected getStepDescription = (): string 
```

## UriResolverExtensionFileReader
```ts
/** An IFileReader that reads files by invoking URI Resolver Extension wrappers */
export class UriResolverExtensionFileReader implements IFileReader 
```

### constructor
```ts
  /**
   * Construct a UriResolverExtensionFileReader
   *
   * @param _resolverExtensionUri - URI of the URI Resolver Extension wrapper
   * @param _wrapperUri - URI of the wrap package to read from
   * @param _client - A CoreClient instance
   * */
  constructor(
    private readonly _resolverExtensionUri: Uri,
    private readonly _wrapperUri: Uri,
    private readonly _client: CoreClient
  ) 
```

### Methods

#### readFile
```ts
  /**
   * Read a file
   *
   * @param filePath - the file's path from the wrap package root
   *
   * @returns a Result containing a buffer if successful, or an error
   * */
  async readFile(filePath: string): Promise<Result<Uint8Array, Error>> 
```

## UriResolverWrapper
```ts
/**
 * An IUriResolver that delegates resolution to a wrapper that implements
 * the URI Resolver Extension Interface
 * */
export class UriResolverWrapper extends ResolverWithHistory<unknown> 
```

### constructor
```ts
  /**
   * construct a UriResolverWrapper
   *
   * @param implementationUri - URI that resolves to a URI Resolver Extension implementation
   * */
  constructor(public readonly implementationUri: Uri) 
```

### Methods

#### getStepDescription
```ts
  /**
   * A utility function for generating step descriptions to facilitate resolution context updates
   *
   * @returns text describing the URI resolution step
   * */
  protected getStepDescription = (): string 
```

#### tryResolveUriWithImplementation
```ts
/**
 * Attempt to resolve a URI by invoking a URI Resolver Extension wrapper
 *
 * @param uri - the URI to resolve
 * @param implementationUri - URI that resolves to a URI Resolver Extension implementation
 * @param client - a CoreClient instance that will be used to invoke the URI Resolver Extension wrapper
 * @param resolutionContext - the current URI resolution context
 * @returns A Promise with a Result containing either URI or a manifest if successful
 */
const tryResolveUriWithImplementation = async (
  uri: Uri,
  implementationUri: Uri,
  client: CoreClient,
  resolutionContext: IUriResolutionContext
): Promise<
  Result<UriResolverInterface.MaybeUriOrManifest | undefined, unknown>
> 
```

#### _tryResolverUri (protected)
```ts
  /**
   * Attempt to resolve a URI by invoking a URI Resolver Extension wrapper, then
   * parse the result to a wrap package, a wrapper, or a URI
   *
   * @param uri - the URI to resolve
   * @param client - a CoreClient instance that may be used to invoke a wrapper that implements the UriResolver interface
   * @param resolutionContext - the current URI resolution context
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  protected async _tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, unknown>> 
```

## Development

This package is open-source. It lives within the [Polywrap toolchain monorepo](https://github.com/polywrap/toolchain/tree/origin/packages/js/uri-resolver-extensions). Contributions from the community are welcomed!

### Build
```bash
nvm use && yarn install && yarn build
```

### Test
```bash
yarn test
``