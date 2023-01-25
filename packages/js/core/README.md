# @polywrap/core-js

A TypeScript / JavaScript implementation of the WRAP standard, including all fundamental types & algorithms.

# Reference

## Types

### CoreClient

```ts

/** Core Client configuration that can be passed to the PolywrapClient or PolywrapCoreClient constructors */
export interface CoreClientConfig {
  /** set environmental variables for a wrapper */
  readonly interfaces?: Readonly<InterfaceImplementations[]>;

  /** register interface implementations */
  readonly envs?: Readonly<Env[]>;

  /** configure URI resolution for redirects, packages, and wrappers */
  readonly resolver: Readonly<IUriResolver<unknown>>;
}

/** Options for CoreClient's getFile method */
export interface GetFileOptions {
  /** file path from wrapper root */
  path: string;

  /** file encoding */
  encoding?: "utf-8" | string;
}

/** Options for CoreClient's getImplementations method */
export interface GetImplementationsOptions {
  /** If true, follow redirects to resolve URIs */
  applyResolution?: boolean;

  /** Use and update an existing resolution context */
  resolutionContext?: IUriResolutionContext;
}

/** Options for CoreClient's validate method */
export interface ValidateOptions {
  /** Validate full ABI */
  abi?: boolean;

  /** Recursively validate import URIs */
  recursive?: boolean;
}

/** CoreClient invokes wrappers and interacts with wrap packages. */
export interface CoreClient extends Invoker, UriResolverHandler<unknown> {
  /**
   * Returns the configuration used to instantiate the client
   *
   * @returns an immutable core client config
   */
  getConfig(): CoreClientConfig;

  /**
   * returns all interfaces from the configuration used to instantiate the client
   *
   * @returns an array of interfaces and their registered implementations
   */
  getInterfaces(): readonly InterfaceImplementations[] | undefined;

  /**
   * returns all env registrations from the configuration used to instantiate the client
   *
   * @returns an array of env objects containing wrapper environmental variables
   */
  getEnvs(): readonly Env[] | undefined;

  /**
   * returns an env (a set of environmental variables) from the configuration used to instantiate the client
   *
   * @param uri - the URI used to register the env
   * @returns an env, or undefined if an env is not found at the given URI
   */
  getEnvByUri(uri: Uri): Env | undefined;

  /**
   * returns the URI resolver from the configuration used to instantiate the client
   *
   * @returns an object that implements the IUriResolver interface
   */
  getResolver(): IUriResolver<unknown>;

  /**
   * returns a package's wrap manifest
   *
   * @param uri - a wrap URI
   * @returns a Result containing the WrapManifest if the request was successful
   */
  getManifest(uri: Uri): Promise<Result<WrapManifest, WrapError>>;

  /**
   * returns a file contained in a wrap package
   *
   * @param uri - a wrap URI
   * @param options - { path: string; encoding?: "utf-8" | string }
   * @returns a Promise of a Result containing a file if the request was successful
   */
  getFile(
    uri: Uri,
    options: GetFileOptions
  ): Promise<Result<string | Uint8Array, WrapError>>;

  /**
   * returns the interface implementations associated with an interface URI
   *  from the configuration used to instantiate the client
   *
   * @param uri - a wrap URI
   * @param options - { applyResolution?: boolean; resolutionContext?: IUriResolutionContext }
   * @returns a Result containing URI array if the request was successful
   */
  getImplementations(
    uri: Uri,
    options: GetImplementationsOptions
  ): Promise<Result<Uri[], WrapError>>;
}

```

### Env

```ts

/** A map of string-indexed, Msgpack-serializable environmental variables associated with a wrapper */
export interface Env {
  /** Uri of wrapper */
  uri: Uri;

  /** Env variables used by the module */
  env: Record<string, unknown>;
}
```

### InterfaceImplementations

```ts

/** An interface and a list of wrappers that implement the interface */
export interface InterfaceImplementations {
  /** Uri of interface */
  interface: Uri;

  /** Uris of implementations */
  implementations: Uri[];
}

```

### Invoke

```ts

/** Options required for an Wrapper invocation. */
export interface InvokeOptions {
  /** The Wrapper's URI */
  uri: Uri;

  /** Method to be executed. */
  method: string;

  /** Arguments for the method, structured as a map, removing the chance of incorrectly ordered arguments. */
  args?: Record<string, unknown> | Uint8Array;

  /** Env variables for the wrapper invocation. */
  env?: Record<string, unknown>;

  /** A Uri resolution context */
  resolutionContext?: IUriResolutionContext;
}

/**
 * Result of an Wrapper invocation.
 *
 * @template TData Type of the invoke result data.
 */
export type InvokeResult<TData = unknown> = Result<TData, WrapError>;

/**
 * Provides options for the invoker to set based on the state of the invocation.
 * Extends InvokeOptions.
 */
export interface InvokerOptions extends InvokeOptions {
  /** If true, the InvokeResult will (if successful) contain a Msgpack-encoded byte array */
  encodeResult?: boolean;
}

/**
 * An entity capable of invoking wrappers.
 *
 * @template TData Type of the invoke result data.
 */
export interface Invoker {
  /**
   * Invoke a wrapper using an instance of the wrapper.
   *
   * @param options - invoker options and a wrapper instance to invoke
   * @returns A Promise with a Result containing the return value or an error
   */
  invokeWrapper<TData = unknown>(
    options: InvokerOptions & { wrapper: Wrapper }
  ): Promise<InvokeResult<TData>>;

  /**
   * Invoke a wrapper.
   *
   * @remarks
   * Unlike `invokeWrapper`, this method automatically retrieves and caches the wrapper.
   *
   * @param options - invoker options
   * @returns A Promise with a Result containing the return value or an error
   */
  invoke<TData = unknown>(
    options: InvokerOptions
  ): Promise<InvokeResult<TData>>;
}

/**
 * Result of a Wrapper invocation, possibly Msgpack-encoded.
 *
 * @template TData Type of the invoke result data.
 */
export type InvocableResult<TData = unknown> = InvokeResult<TData> & {
  /** If true, result (if successful) contains a Msgpack-encoded byte array */
  encoded?: boolean;
};

/** An invocable entity, such as a wrapper. */
export interface Invocable {
  /**
   * Invoke this object.
   *
   * @param options - invoke options
   * @param invoker - an Invoker, capable of invoking this object
   * @returns A Promise with a Result containing the return value or an error
   */
  invoke(
    options: InvokeOptions,
    invoker: Invoker
  ): Promise<InvocableResult<unknown>>;
}

```

### IUriPackage

```ts

/** Associates a URI with an embedded wrap package */
export interface IUriPackage {
  /** The package's URI */
  uri: Uri;

  /** The wrap package */
  package: IWrapPackage;
}

```

### IUriRedirect

```ts

/** Redirect invocations from one URI to another */
export interface IUriRedirect {
  /** URI to redirect from */
  from: Uri;

  /** URI to redirect to */
  to: Uri;
}

```

### IUriWrapper

```ts

/** Associates a URI with an embedded wrapper */
export interface IUriWrapper {
  /** The URI to resolve to the wrapper */
  uri: Uri;

  /** A wrapper instance */
  wrapper: Wrapper;
}

```

### IWrapPackage

```ts

/** Options for IWrapPackage's getManifest method */
export interface GetManifestOptions {
  /** If true, manifest validation step will be skipped */
  noValidate?: boolean;
}

/** A wrap package, capable of producing instances of a wrapper and its manifest */
export interface IWrapPackage {
  /**
   * Produce an instance of the wrap manifest
   *
   * @param options - GetManifestOptions; customize manifest retrieval
   * @returns A Promise with a Result containing the wrap manifest or an error
   */
  getManifest(
    options?: GetManifestOptions
  ): Promise<Result<WrapManifest, Error>>;

  /**
   * Produce an instance of the wrapper
   *
   * @param options - DeserializeManifestOptions; customize manifest deserialization
   * @returns A Promise with a Result containing the wrapper or an error
   */
  createWrapper(
    options?: DeserializeManifestOptions
  ): Promise<Result<Wrapper, Error>>;
}

```

### MaybeAsync

```ts

/** Alias for a type that is either a value or a promise that resolves to the value */
export type MaybeAsync<T> = Promise<T> | T;

```

### Uri

#### UriConfig
```ts
/** URI configuration */
export interface UriConfig {
  /** URI Authority: allows the Polywrap URI resolution algorithm to determine an authoritative URI resolver. */
  authority: string;

  /** URI Path: tells the Authority where the Wrapper resides. */
  path: string;

  /** Full string representation of URI */
  uri: string;
}
```

#### Uri

```ts
/**
 * A Polywrap URI. Some examples of valid URIs are:
 * wrap://ipfs/QmHASH
 * wrap://ens/sub.dimain.eth
 * wrap://fs/directory/file.txt
 * wrap://uns/domain.crypto
 *
 * Breaking down the various parts of the URI, as it applies
 * to [the URI standard](https://tools.ietf.org/html/rfc3986#section-3):
 * **wrap://** - URI Scheme: differentiates Polywrap URIs.
 * **ipfs/** - URI Authority: allows the Polywrap URI resolution algorithm to determine an authoritative URI resolver.
 * **sub.domain.eth** - URI Path: tells the Authority where the Wrapper resides.
 */
export class Uri {
```

##### constructor
```ts
  /**
   * Construct a Uri instance from a wrap URI string
   *
   * @remarks
   * Throws if URI string is invalid
   *
   * @param uri - a string representation of a wrap URI
   */
  constructor(uri: string) 
```

##### authority
```ts
  /** @returns Uri authority */
  public get authority(): string 
```

##### path
```ts
  /** @returns Uri path */
  public get path(): string 
```

##### uri
```ts
  /** @returns Uri string representation */
  public get uri(): string 
```

##### equals
```ts
  /** Test two Uri instances for equality */
  public static equals(a: Uri, b: Uri): boolean 
```

##### isUri
```ts
  /**
   * Check if a value is an instance of Uri
   *
   * @param value - value to check
   * @returns true if value is a Uri instance */
  public static isUri(value: unknown): value is Uri 
```

##### isValidUri
```ts
  /**
   * Test if a URI string is a valid wrap URI
   *
   * @param uri - URI string
   * @param parsed? - UriConfig to update (mutate) with content of URI string
   * @returns true if input string is a valid wrap URI */
  public static isValidUri(uri: string, parsed?: UriConfig): boolean 
```

##### toString
```ts
  /** @returns Uri string representation */
  public toString(): string 
```

##### toJSON
```ts
  /** @returns Uri string representation */
  public toJSON(): string 
```

##### parseUri
```ts
  /**
   * Parse a wrap URI string into its authority and path
   *
   * @param uri - a string representation of a wrap URI
   * @returns A Result containing a UriConfig, if successful, or an error
   */
  public static parseUri(uri: string): Result<UriConfig, Error> 
```

##### from
```ts
  /**
   * Construct a Uri instance from a Uri or a wrap URI string
   *
   * @remarks
   * Throws if URI string is invalid
   *
   * @param uri - a Uri instance or a string representation of a wrap URI
   */
  public static from(uri: Uri | string): Uri 
```

### UriResolver

```ts

/** Options required for URI resolution. */
export interface TryResolveUriOptions {
  /** The Wrapper's URI */
  uri: Uri;

  /** A URI resolution context */
  resolutionContext?: IUriResolutionContext;
}

/** An entity capable of resolving a wrap URI, typically by using an IUriResolver implementation */
export interface UriResolverHandler<TError = undefined> {
  /**
   * Resolve a URI to a wrap package, a wrapper, or a uri
   *
   * @param options - TryResolveUriOptions
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  tryResolveUri(
    options?: TryResolveUriOptions
  ): Promise<Result<UriPackageOrWrapper, TError>>;
}

```

### Wrapper

```ts

/**
 * The Wrapper definition, which can be used to spawn
 * many invocations of this particular Wrapper. Internally
 * this class may do things like caching WASM bytecode, spawning
 * worker threads, or indexing into resolvers to find the requested method.
 */
export interface Wrapper extends Invocable {
  /**
   * Invoke the Wrapper based on the provided [[InvokeOptions]]
   *
   * @param options Options for this invocation.
   * @param invoker The client instance requesting this invocation.
   * This client will be used for any sub-invokes that occur.
   */
  invoke(
    options: InvokeOptions,
    invoker: Invoker
  ): Promise<InvocableResult<unknown>>;

  /**
   * Get a file from the Wrapper package.
   *
   * @param options Configuration options for file retrieval
   */
  getFile(options: GetFileOptions): Promise<Result<Uint8Array | string, Error>>;

  /**
   * Get a manifest from the Wrapper package.
   */
  getManifest(): WrapManifest;
}

```

## UriResolverInterface

### MaybeUriOrManifest
```ts
/** Contains either a Uri, a manifest, or neither */
export interface MaybeUriOrManifest {
  /** wrap URI */
  uri?: string | null;

  /** Serialized wrap manifest */
  manifest?: Uint8Array | null;
}
```

### Module

#### tryResolveUri
```ts
  /**
   * Use an invoker to try to resolve a URI using a wrapper that implements the UriResolver interface
   *
   * @param invoker - invokes the wrapper with the resolution URI as an argument
   * @param wrapper - URI for wrapper that implements the UriResolver interface
   * @param uri - the URI to resolve
   */
  tryResolveUri: async (
    invoker: Invoker,
    wrapper: Uri,
    uri: Uri
  ): Promise<Result<MaybeUriOrManifest, WrapError>> 
```

#### getFile
```ts
  /**
   * Use an invoker to fetch a file using a wrapper that implements the UriResolver interface
   *
   * @param invoker - invokes the wrapper with the filepath as an argument
   * @param wrapper - URI for wrapper that implements the UriResolver interface
   * @param path - a filepath, the format of which depends on the UriResolver
   */
  getFile: async (
    invoker: Invoker,
    wrapper: Uri,
    path: string
  ): Promise<Result<Uint8Array | undefined, WrapError>> 
```

## Uri Resolution

### IUriResolutionContext

```ts
/** Track and output URI resolution state, path, and history */
export interface IUriResolutionContext {
  /**
   * Check if a URI is in the process of being resolved
   *
   * @param uri - URI to check
   * @return true if URI resolution is in process, false otherwise
   */
  isResolving(uri: Uri): boolean;

  /**
   * Start resolving a URI
   *
   * @param uri - Uri to resolve
   */
  startResolving(uri: Uri): void;

  /**
   * Stop resolving a URI
   *
   * @param uri - Uri being resolved
   */
  stopResolving(uri: Uri): void;

  /**
   * Push a step onto the resolution history stack
   *
   * @param step - A completed resolution step
   */
  trackStep<TError>(step: IUriResolutionStep<TError>): void;

  /** @return history of all URI resolution steps completed */
  getHistory(): IUriResolutionStep<unknown>[];

  /** @return current URI resolution path */
  getResolutionPath(): Uri[];

  /**
   * Create a new resolution context using the current URI resolution path
   *
   * @return a UriResolutionContext
   */
  createSubHistoryContext(): IUriResolutionContext;

  /**
   * Create a new resolution context using the current URI resolution history
   *
   * @return a UriResolutionContext
   */
  createSubContext(): IUriResolutionContext;
}
```

### IUriResolutionStep

```ts
/** A step in the URI resolution algorithm */
export interface IUriResolutionStep<TError = undefined> {
  /** The current URI being resolved */
  sourceUri: Uri;

  /** The resolution result for the current URI */
  result: Result<UriPackageOrWrapper, TError>;

  /** A text/visual description of this URI step */
  description?: string;

  /** History of sub-steps that exist within the context of this URI resolution step */
  subHistory?: IUriResolutionStep<TError>[];
}
```

### IUriResolver

```ts
/** Defines entity capable of resolving a wrap URI */
export interface IUriResolver<TError = undefined> {
  /**
   * Resolve a URI to a wrap package, a wrapper, or a uri
   *
   * @param uri - the URI to resolve
   * @param client - a CoreClient instance that may be used to invoke a wrapper that implements the UriResolver interface
   * @param resolutionContext - the current URI resolution context
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError>>;
}
```

### UriPackageOrWrapper

```ts

/** Indicates that a URI resolved to a Uri */
export type UriValue = {
  type: "uri";
  uri: Uri;
};

/** Indicates that a URI resolved to a wrap package */
export type UriPackageValue = IUriPackage & {
  type: "package";
};

/** Indicates that a URI resolved to a wrapper */
export type UriWrapperValue = IUriWrapper & {
  type: "wrapper";
};

/** indicates that a URI resolved to either a wrap package, a wrapper, or a URI */
export type UriPackageOrWrapper = UriValue | UriPackageValue | UriWrapperValue;

```

### UriResolutionContext

```ts
/** An implementation of the IUriResolutionContext interface */
// $start: UriResolutionContext
/** An implementation of the IUriResolutionContext interface */
export class UriResolutionContext implements IUriResolutionContext {
```

#### constructor

```ts
  /** Construct a UriResolutionContext */
  constructor();
  constructor(
    resolvingUriMap: Map<string, boolean>,
    resolutionPath: Set<string>
  );
  constructor(
    resolvingUriMap: Map<string, boolean>,
    history: IUriResolutionStep<unknown>[]
  );
  constructor(
    resolvingUriMap?: Map<string, boolean>,
    resolutionPathOrHistory?: Set<string> | IUriResolutionStep<unknown>[]
  ) 
```
