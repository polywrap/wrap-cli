# @polywrap/uri-resolvers
<a href="https://www.npmjs.com/package/@polywrap/uri-resolvers-js" target="_blank" rel="noopener noreferrer">
<img src="https://img.shields.io/npm/v/@polywrap/uri-resolvers-js.svg" alt="npm"/>
</a>

<br/>
<br/>
URI resolvers to customize URI resolution in the Polywrap Client.

## Installation

```bash
npm install --save @polywrap/uri-resolvers-js
```

## Usage

This example is similar to the default resolver used by the ClientConfigBuilder in the @polywrap/client-config-builder-js package.

```ts
  const resolver = RecursiveResolver.from(
    WrapperCacheResolver.from(
      [
        StaticResolver.from([
            ...redirects,
            ...wrappers,
            ...packages,
          ]),
      ],
      new WrapperCache()
    )
  );
```

# Reference

## UriResolverAggregatorBase
```ts
/**
 * Abstract class for IUriResolver implementations that aggregate multiple resolvers.
 * The UriResolverAggregatorBase class attempts to resolve a URI by sequentially
 * attempting resolution with each of its composite resolvers.
 * */
export abstract class UriResolverAggregatorBase<
  TResolutionError = undefined,
  TGetResolversError = undefined
> implements IUriResolver<TResolutionError | TGetResolversError> 
```

### Methods

#### getUriResolvers
```ts
  /**
   * Get a list of URI Resolvers
   *
   * @param uri - the URI to query for resolvers
   * @param client - a CoreClient instance that can be used to make an invocation
   * @param resolutionContext - a resolution context to update when resolving URIs
   *
   * @returns a list of IUriResolver or an error
   * */
  abstract getUriResolvers(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<IUriResolver<unknown>[], TGetResolversError>>;
```

#### tryResolveUri
```ts
  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   * Attempts to resolve the URI using each of the aggregated resolvers sequentially.
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
  ): Promise<
    Result<UriPackageOrWrapper, TResolutionError | TGetResolversError>
  > 
```

#### getStepDescription (protected)
```ts
  /**
   * A utility function for generating step descriptions to facilitate resolution context updates
   *
   * @param uri - the URI being resolved
   * @param result - the result of a resolution attempt
   *
   * @returns text describing the URI resolution step
   * */
  protected abstract getStepDescription(
    uri: Uri,
    result: Result<UriPackageOrWrapper, TResolutionError>
  ): string;
```

#### tryResolveUriWithResolvers (protected)
```ts
  /**
   * Using each of the aggregated resolvers, attempt to resolve a URI
   *
   * @param uri - the URI to resolve
   * @param client - a CoreClient instance that can be used to make an invocation
   * @param resolvers - a list of IUriResolver implementations
   * @param resolutionContext - a resolution context to update when resolving URIs
   *
   * @returns a URI, a Wrap Package, or a Wrapper (or an error)
   * */
  protected async tryResolveUriWithResolvers(
    uri: Uri,
    client: CoreClient,
    resolvers: IUriResolver<unknown>[],
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TResolutionError>> 
```

## UriResolverAggregator
```ts
/**
 * An implementation of UriResolverAggregatorBase
 */
export class UriResolverAggregator<
  TResolutionError = undefined,
  TGetResolversError = undefined
> extends UriResolverAggregatorBase<
  TResolutionError,
  TGetResolversError
> 
```

### Types

#### GetResolversFunc
```ts
/**
 * A function that returns a list of resolvers
 *
 * @param uri - the URI to query
 * @param client - a CoreClient instance
 * */
export type GetResolversFunc = (
  uri: Uri,
  client: CoreClient
) => Promise<IUriResolver<unknown>[]>;
```

#### GetResolversWithErrorFunc
```ts
/**
 * A function that returns a list of resolvers or an error
 *
 * @param uri - the URI to query
 * @param client - a CoreClient instance
 * */
export type GetResolversWithErrorFunc<TError> = (
  uri: Uri,
  client: CoreClient
) => Promise<Result<IUriResolver<unknown>[], TError>>;
```

### Methods

#### constructor
```ts
  /**
   * Creates a UriResolverAggregator from a list of resolvers, or from a function
   * that returns a list of resolvers
   * */
  constructor(resolvers: UriResolverLike[], resolverName?: string);
  constructor(
    resolvers: (
      uri: Uri,
      client: CoreClient
    ) => Promise<Result<IUriResolver<unknown>[], TGetResolversError>>,
    resolverName?: string
  );
  constructor(resolvers: GetResolversFunc, resolverName?: string);
  constructor(
    resolvers:
      | UriResolverLike[]
      | GetResolversFunc
      | GetResolversWithErrorFunc<TGetResolversError>,
    private _resolverName?: string
  ) 
```

#### getUriResolvers
```ts
  /**
   * Get a list of URI Resolvers
   *
   * @param uri - the URI to query for resolvers
   * @param client - a CoreClient instance that can be used to make an invocation
   *
   * @returns a list of IUriResolver or an error
   * */
  async getUriResolvers(
    uri: Uri,
    client: CoreClient
  ): Promise<Result<IUriResolver<unknown>[], TGetResolversError>> 
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

## IWrapperCache
```ts
/** A Wrapper cache */
export interface IWrapperCache {
  /** get a Wrapper from the cache, given its URI index */
  get(uri: Uri): MaybeAsync<Wrapper | undefined>;

  /** add a Wrapper to the cache, indexed by a URI */
  set(uri: Uri, wrapper: Wrapper): MaybeAsync<void>;
}
```

## WrapperCache
```ts
/**
 * A minimal implementation of IWrapperCache
 * */
export class WrapperCache implements IWrapperCache 
```

### Methods

#### get
```ts
  /** get a Wrapper from the cache, given its URI index */
  get(uri: Uri): Wrapper | undefined 
```

#### set
```ts
  /** add a Wrapper to the cache, indexed by a URI */
  set(uris: Uri, wrapper: Wrapper): void 
```

## WrapperCacheResolver
```ts
/**
 * An IUriResolver implementation that caches wrappers once they are resolved.
 * It does not cache URIs and packages.
 * The WrapperCacheResolver wraps an IUriResolver implementation and delegates resolution to it.
 * */
export class WrapperCacheResolver<TError>
  implements IUriResolver<TError | Error> 
```

### constructor
```ts
  /**
   * Creates a WrapperCacheResolvers
   *
   * @param _resolverToCache - a resolver to delegate resolution to
   * @param _cache - a wrapper cache
   * */
  constructor(
    private _resolverToCache: IUriResolver<TError>,
    private _cache: IWrapperCache
  ) 
```

### Methods

#### from
```ts
  /**
   * Creates a WrapperCacheResolver from a resolver-like object
   *
   * @param resolver - a resolver-like item to delegate resolution to
   * @param cache - a wrapper cache
   * @param options - control wrapper manifest deserialization
   *
   * @returns a WrapperCacheResolver
   * */
  static from<TResolverError = unknown>(
    resolver: UriResolverLike,
    cache: IWrapperCache,
  ): WrapperCacheResolver<TResolverError> 
```

#### tryResolveUri
```ts
  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   * If successful, cache the result.
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
  ): Promise<Result<UriPackageOrWrapper, TError | Error>> 
```

## getUriResolutionPath
```ts
/**
 * Get a resolution path from the history of a URI resolution attempt
 *
 * @param history - the resolution context
 * @returns the URI's resolution path
 * */
export const getUriResolutionPath = (
  history: IUriResolutionStep<unknown>[]
): IUriResolutionStep<unknown>[] 
```

## InfiniteLoopError
```ts
/**
 * Error used if the URI resolution path contains an infinite loop
 * */
export class InfiniteLoopError extends Error 
```

### constructor
```ts
  /**
   * Create an InfiniteLoopError
   *
   * @param _uri - URI being resolved
   * @param _history - URI resolution history
   * */
  constructor(
    private readonly _uri: Uri,
    private readonly _history: IUriResolutionStep<unknown>[]
  ) 
```

## ResolverWithHistory
```ts
/** An abstract IUriResolver implementation that updates the resolution context */
export abstract class ResolverWithHistory<TError = undefined>
  implements IUriResolver<TError> 
```

### Methods

#### tryResolveUri
```ts
  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   * Updates the resolution context with the result.
   *
   * @remarks
   * This method calls the internal abstract method _tryResolveUri before
   * updating the resolution context. Implementations are expect to place
   * resolution logic in _tryResolveUri.
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
  ): Promise<Result<UriPackageOrWrapper, TError>> 
```

#### getStepDescription (protected)
```ts
  /**
   * A utility function for generating step descriptions to facilitate resolution context updates
   *
   * @param uri - the URI being resolved
   * @param result - the result of a resolution attempt
   *
   * @returns text describing the URI resolution step
   * */
  protected abstract getStepDescription(
    uri: Uri,
    result: Result<UriPackageOrWrapper, TError>
  ): string;
```

#### _tryResolveUri (protected)
```ts
  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   * Updates the resolution context with the result.
   *
   * @param uri - the URI to resolve
   * @param client - a CoreClient instance that may be used to invoke a wrapper that implements the UriResolver interface
   * @param resolutionContext - the current URI resolution context
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  protected abstract _tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError>>;
```

## ResolverWithLoopGuard
```ts
/** An IUriResolver implementation that prevents infinite loops in the resolution path. */
export class ResolverWithLoopGuard<TError = undefined>
  implements IUriResolver<TError | InfiniteLoopError> 
```

### constructor
```ts
  /**
   * Construct a ResolverWithLoopGuard
   *
   * @param _resolver - a resolution to delegate resolution to
   * */
  constructor(private _resolver: IUriResolver<TError>) 
```

### Methods

#### from
```ts
  /**
   * Create a ResolverWithLoopGuard from a resolver-like object
   *
   * @param resolver - a resolver-like item to delegate resolution to
   *
   * @returns a ResolverWithLoopGuard
   * */
  static from<TResolverError = unknown>(
    resolver: UriResolverLike
  ): ResolverWithLoopGuard<TResolverError> 
```

#### tryResolveUri
```ts
  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   * Ensures the URI is not caught in an infinite loop by checking if it is already resolving.
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
  ): Promise<Result<UriPackageOrWrapper, TError | InfiniteLoopError>> 
```

## PackageToWrapperResolver
```ts
/**
 * An IUriResolver implementation that initalizes wrappers from resolved packages.
 * The PackageToWrapperResolver wraps an IUriResolver implementation and delegates resolution to it.
 * */
export class PackageToWrapperResolver<TError>
  implements IUriResolver<TError | Error> 
```

### constructor
```ts
  /**
   * Creates a PackageToWrapperResolver
   *
   * @param _resolver - a resolver to delegate resolution to
   * @param _options - control wrapper manifest deserialization
   * */
  constructor(
    private _resolver: IUriResolver<TError>,
    private _options?: {
      deserializeManifestOptions?: DeserializeManifestOptions;
    }
  ) 
```

### Methods

#### from
```ts
  /**
   * Creates a PackageToWrapperResolver from a resolver-like object
   *
   * @param resolver - a resolver-like item to delegate resolution to
   * @param options - control wrapper manifest deserialization
   *
   * @returns a PackageToWrapperResolver
   * */
  static from<TResolverError = unknown>(
    resolver: UriResolverLike,
    options?: { deserializeManifestOptions?: DeserializeManifestOptions }
  ): PackageToWrapperResolver<TResolverError> 
```

#### tryResolveUri
```ts
  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   * If successful, cache the result.
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
  ): Promise<Result<UriPackageOrWrapper, TError | Error>> 
```

## UriResolutionResult
```ts
/** Factory for creating Result from URI resolution output */
export class UriResolutionResult<TError = undefined> 
```

### Methods

#### ok
```ts
  /** Returns a Result with `ok` set to true */
  static ok<TError = undefined>(uri: Uri): Result<UriPackageOrWrapper, TError>;
  static ok<TError = undefined>(
    uri: Uri,
    wrapPackage: IWrapPackage
  ): Result<UriPackageOrWrapper, TError>;
  static ok<TError = undefined>(
    uri: Uri,
    wrapper: Wrapper
  ): Result<UriPackageOrWrapper, TError>;
  static ok<TError = undefined>(
    uriPackageOrWrapper: UriPackageOrWrapper
  ): Result<UriPackageOrWrapper, TError>;
  static ok<TError = undefined>(
    uriPackageOrWrapper: Uri | UriPackageOrWrapper,
    packageOrWrapper?: IWrapPackage | Wrapper
  ): Result<UriPackageOrWrapper, TError> 
```

#### err
```ts
  /** Returns a Result with `ok` set to false */
  static err<TError = unknown>(
    error: TError
  ): Result<UriPackageOrWrapper, TError> 
```

## UriResolver
```ts
/** An IUriResolver factory */
export class UriResolver 
```

### Methods

#### from
```ts
  /**
   * Create an IUriResolver instance
   *
   * @param resolverLike - an object that can be transformed into a resolver
   * @param resolverName - a name to assign to the resolver in resolution history output
   * */
  static from<TError = undefined>(
    resolverLike: UriResolverLike,
    resolverName?: string
  ): IUriResolver<TError> 
```

## UriResolverLike
```ts
/** An UriResolverLike can be one of three things:
 * - An IUriResolver
 * - An object that can be transformed into a static IUriResolver
 * - An array of UriResolverLike
 * */
export type UriResolverLike =
  | IUriResolver<unknown>
  | IUriRedirect
  | IUriPackage
  | IUriWrapper
  | UriResolverLike[];
```

## PackageResolver
```ts
/**
 * A Uri Resolver that resolves to an embedded wrap package and correctly updates
 * the resolution history.
 * */
export class PackageResolver extends ResolverWithHistory 
```

### constructor
```ts
  /**
   * Construct a PackageResolver
   *
   * @param _uri - the URI to redirect to the wrap package
   * @param wrapPackage - a wrap package
   * */
  constructor(private _uri: Uri, private wrapPackage: IWrapPackage) 
```

### Methods

#### getStepDescription (protected)
```ts
  /**
   * A utility function for generating step descriptions to facilitate resolution context updates
   *
   * @returns text describing the URI resolution step
   * */
  protected getStepDescription = (): string 
```

#### _tryResolveUri (protected)
```ts
  /**
   * Resolve a URI to a wrap package
   *
   * @param uri - the URI to resolve
   * @returns A Promise with a Result containing a wrap package if successful
   */
  protected async _tryResolveUri(
    uri: Uri
  ): Promise<Result<UriPackageOrWrapper>> 
```

## RedirectResolver
```ts
/**
 * A Uri Resolver that resolves to a new URI and correctly updates the
 * resolution history.
 * */
export class RedirectResolver<
  TUri extends string | Uri = string
> extends ResolverWithHistory 
```

### constructor
```ts
  /**
   * Construct a RedirectResolver
   *
   * @param from - the URI to redirect from
   * @param to - the URI to redirect to
   * */
  constructor(from: TUri, to: TUri) 
```

### Methods

#### getStepDescription (protected)
```ts
  /**
   * A utility function for generating step descriptions to facilitate resolution context updates
   *
   * @returns text describing the URI resolution step
   * */
  protected getStepDescription = (): string 
```

#### _tryResolveUri (protected)
```ts
  /**
   * Resolve a URI to a new URI
   *
   * @param uri - the URI to resolve
   * @returns A Promise with a Result containing a URI if successful
   */
  protected async _tryResolveUri(
    uri: Uri
  ): Promise<Result<UriPackageOrWrapper>> 
```

## WrapperResolver
```ts
/**
 * A Uri Resolver that resolves to an embedded wrapper and correctly updates
 * the resolution history.
 * */
export class WrapperResolver extends ResolverWithHistory 
```

### constructor
```ts
  /**
   * Construct a WrapperResolver
   *
   * @param _uri - the URI to redirect to the wrapper instance
   * @param _wrapper - a wrapper
   * */
  constructor(private _uri: Uri, private _wrapper: Wrapper) 
```

### Methods

#### getStepDescription (protected)
```ts
  /**
   * A utility function for generating step descriptions to facilitate resolution context updates
   *
   * @returns text describing the URI resolution step
   * */
  protected getStepDescription = (): string 
```

#### _tryResolveUri
```ts
  /**
   * Resolve a URI to a wrapper
   *
   * @param uri - the URI to resolve
   * @returns A Promise with a Result containing a wrapper if successful
   */
  protected async _tryResolveUri(
    uri: Uri
  ): Promise<Result<UriPackageOrWrapper>> 
```

## StaticResolver
```ts
/**
 * An IUriResolver implementation that efficiently delegates URI resolution to
 * static resolvers--i.e. those that resolve to embedded URIs, Wrappers, and Packages
 * */
export class StaticResolver<TError = undefined>
  implements IUriResolver<TError> 
```

### constructor
```ts
  /**
   * Construct a Static Resolver
   *
   * @param uriMap - a mapping of URI to embedded URI, package, or wrapper
   * */
  constructor(public uriMap: Map<string, UriPackageOrWrapper>) 
```

### Methods

#### from
```ts
  /**
   * Create a StaticResolver from a static-resolver-like object
   *
   * @param staticResolverLikes - an array of resolver-like objects to delegate resolution to
   *
   * @returns a StaticResolver
   * */
  static from<TError = undefined>(
    staticResolverLikes: UriResolverLike[]
  ): StaticResolver<TError> 
```

#### tryResolveUri
```ts
  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   *
   * @param uri - the URI to resolve
   * @param _ - not used
   * @param resolutionContext - the current URI resolution context
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  async tryResolveUri(
    uri: Uri,
    _: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError>> 
```

## StaticResolverLike
```ts
/** A StaticResolverLike can be one of two things:
 * - An object that can be transformed into a static IUriResolver
 * - An array of StaticResolverLike
 * */
export type StaticResolverLike =
  | IUriRedirect
  | IUriPackage
  | IUriWrapper
  | StaticResolverLike[];
```

## RequestSynchronizerResolver
```ts
/* Uri resolver that synchronizes requests to the same URI
 * Multiple requests to the same URI will be resolved only once
 * and the result will be cached for subsequent requests (only for the duration of that first request)
 * Can use the `shouldIgnoreCache` option to determine whether to ignore the cached request in case of an error
 * (default is to use the cache)
 */
export class RequestSynchronizerResolver<TError>
  implements IUriResolver<TError> 
```

### constructor
```ts
  /**
   * Construct a RequestSynchronizerResolver
   *
   * @param resolverToSynchronize - the inner resolve whose resolution will be synchronized
   * @param options - the optional options containing the `shouldIgnoreCache` error handler
   * */
  constructor(
    private resolverToSynchronize: IUriResolver<TError>,
    private options?: {
      shouldIgnoreCache?: (error: TError | undefined) => boolean;
    }
  ) 
```

### Methods

#### from
```ts
  /**
   * Create a RequestSynchronizerResolver from a static-resolver-like object
   *
   * @param resolver - a resolver-like object whose resolution will be synchronized
   * @param options - the optional options containing the `shouldIgnoreCache` error handler
   *
   * @returns a RequestSynchronizerResolver
   * */
  static from<TResolverError = unknown>(
    resolver: UriResolverLike,
    options?: {
      shouldIgnoreCache?: (error: TResolverError | undefined) => boolean;
    }
  ): RequestSynchronizerResolver<TResolverError> 
```

#### tryResolveUri
```ts
  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   * Attempts to resolve the URI using each of the aggregated resolvers sequentially.
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
  ): Promise<Result<UriPackageOrWrapper, TError>> 
```


## Development

This package is open-source. It lives within the [Polywrap toolchain monorepo](https://github.com/polywrap/toolchain/tree/origin/packages/js/uri-resolvers). Contributions from the community are welcomed!

### Build
```bash
nvm use && yarn install && yarn build
```

### Test
```bash
yarn test
``