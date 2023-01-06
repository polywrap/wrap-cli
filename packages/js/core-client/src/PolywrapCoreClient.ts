import { UriResolverError } from "./UriResolverError";

import {
  Wrapper,
  CoreClient,
  Env,
  GetFileOptions,
  GetImplementationsOptions,
  InterfaceImplementations,
  InvokeOptions,
  InvokerOptions,
  Uri,
  getImplementations,
  TryResolveUriOptions,
  IUriResolver,
  IUriResolutionContext,
  UriPackageOrWrapper,
  UriResolutionContext,
  getEnvFromUriHistory,
  InvokeResult,
  buildCleanUriHistory,
  CoreClientConfig,
} from "@polywrap/core-js";
import { msgpackEncode, msgpackDecode } from "@polywrap/msgpack-js";
import {
  DeserializeManifestOptions,
  WrapManifest,
} from "@polywrap/wrap-manifest-types-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";

export class PolywrapCoreClient implements CoreClient {
  /**
   * Instantiate a PolywrapClient
   *
   * @param config - a core client configuration
   */
  constructor(private _config: CoreClientConfig) {}

  /**
   * Returns the configuration used to instantiate the client
   *
   * @returns an immutable Polywrap client config
   */
  public getConfig(): CoreClientConfig {
    return this._config;
  }

  /**
   * returns all plugin registrations from the configuration used to instantiate the client
   *
   * @returns an array of plugin registrations
   */
  /**
   * returns a plugin package from the configuration used to instantiate the client
   *
   * @param uri - the uri used to register the plugin
   * @returns a plugin package, or undefined if a plugin is not found at the given uri
   */
  /**
   * returns all interfaces from the configuration used to instantiate the client
   *
   * @returns an array of interfaces and their registered implementations
   */
  public getInterfaces(): readonly InterfaceImplementations[] | undefined {
    return this._config.interfaces;
  }

  /**
   * returns all env registrations from the configuration used to instantiate the client
   *
   * @returns an array of env objects containing wrapper environmental variables
   */
  public getEnvs(): readonly Env[] | undefined {
    return this._config.envs;
  }

  /**
   * returns the URI resolver from the configuration used to instantiate the client
   *
   * @returns an object that implements the IUriResolver interface
   */
  public getResolver(): IUriResolver<unknown> {
    return this._config.resolver;
  }

  /**
   * returns an env (a set of environmental variables) from the configuration used to instantiate the client
   *
   * @param uri - the URI used to register the env
   * @returns an env, or undefined if an env is not found at the given URI
   */
  public getEnvByUri(uri: Uri): Env | undefined {
    const uriUri = Uri.from(uri);

    const envs = this.getEnvs();
    if (!envs) {
      return undefined;
    }

    return envs.find((environment) => Uri.equals(environment.uri, uriUri));
  }

  /**
   * returns a package's wrap manifest
   *
   * @param uri - a wrap URI
   * @param options - { noValidate?: boolean }
   * @returns a Result containing the WrapManifest if the request was successful
   */
  public async getManifest(uri: Uri): Promise<Result<WrapManifest, Error>> {
    const load = await this.loadWrapper(Uri.from(uri), undefined);
    if (!load.ok) {
      return load;
    }
    const wrapper = load.value;
    const manifest = wrapper.getManifest();

    return ResultOk(manifest);
  }

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
  ): Promise<Result<string | Uint8Array, Error>> {
    const load = await this.loadWrapper(Uri.from(uri), undefined);
    if (!load.ok) {
      return load;
    }
    const wrapper = load.value;

    return await wrapper.getFile(options);
  }

  /**
   * returns the interface implementations associated with an interface URI
   *  from the configuration used to instantiate the client
   *
   * @param uri - a wrap URI
   * @param options - { applyResolution?: boolean }
   * @returns a Result containing URI array if the request was successful
   */
  public async getImplementations(
    uri: Uri,
    options: GetImplementationsOptions = {}
  ): Promise<Result<Uri[], Error>> {
    const applyResolution = !!options.applyResolution;

    const getImplResult = await getImplementations(
      Uri.from(uri),
      this.getInterfaces() ?? [],
      applyResolution ? this : undefined,
      applyResolution ? options.resolutionContext : undefined
    );

    if (!getImplResult.ok) {
      return getImplResult;
    }

    const uris = getImplResult.value;

    return ResultOk(uris);
  }

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
  public async invokeWrapper<TData = unknown>(
    options: InvokerOptions & { wrapper: Wrapper }
  ): Promise<InvokeResult<TData>> {
    try {
      const typedOptions: InvokeOptions = {
        ...options,
        uri: Uri.from(options.uri),
      };

      const wrapper = options.wrapper;
      const invocableResult = await wrapper.invoke(typedOptions, this);

      if (!invocableResult.ok) {
        return ResultErr(invocableResult.error);
      }

      const value = invocableResult.value;

      if (options.encodeResult && !invocableResult.encoded) {
        const encoded = msgpackEncode(value);
        return ResultOk((encoded as unknown) as TData);
      } else if (invocableResult.encoded && !options.encodeResult) {
        const decoded = msgpackDecode(value as Uint8Array);
        return ResultOk(decoded as TData);
      } else {
        return ResultOk(value as TData);
      }
    } catch (error) {
      return ResultErr(error);
    }
  }

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
  public async invoke<TData = unknown>(
    options: InvokerOptions
  ): Promise<InvokeResult<TData>> {
    if (options.uri.authority === "fs") {
      console.log("HELLO FS ", options.uri.uri);
    }
    if (options.uri.authority === "ens") {
      console.log("HELLO ENS ", options.uri.uri);
    }

    try {
      const typedOptions: InvokeOptions = {
        ...options,
        uri: Uri.from(options.uri),
      };

      // console.log("URI", typedOptions.uri.uri);
      if (options.uri.uri === "wrap://ens/externalenv.polywrap.eth") {
        console.log(typedOptions.uri.uri);
      }

      const resolutionContext =
        options.resolutionContext ?? new UriResolutionContext();

      if (options.uri.uri === "wrap://ens/externalenv.polywrap.eth") {
        console.log("CREATE", resolutionContext);

        // @ts-ignore
        await this.loadWrapper(typedOptions.uri, resolutionContext, 1);

        // throw new Error("STOP");
      }

      const loadWrapperResult = await this.loadWrapper(
        typedOptions.uri,
        resolutionContext,
        // @ts-ignore
        2
      );

      if (!loadWrapperResult.ok) {
        return loadWrapperResult;
      }
      const wrapper = loadWrapperResult.value;

      if (options.uri.uri === "wrap://ens/externalenv.polywrap.eth") {
        console.log("LOADED WRAPPER RESOLUTION CONTEXT", resolutionContext);
      }

      const resolutionPath = resolutionContext.getResolutionPath();
      if (options.uri.uri === "wrap://ens/externalenv.polywrap.eth") {
        console.log(resolutionPath);
      }
      const env = getEnvFromUriHistory(
        resolutionPath.length > 0 ? resolutionPath : [typedOptions.uri],
        this
      );
      if (options.uri.uri === "wrap://ens/externalenv.polywrap.eth") {
        console.log(env);
      }

      const invokeResult = await this.invokeWrapper<TData>({
        env: env?.env,
        ...typedOptions,
        wrapper,
      });

      if (!invokeResult.ok) {
        return invokeResult;
      }

      return invokeResult;
    } catch (error) {
      return ResultErr(error);
    }
  }

  /**
   * Resolve a URI to a wrap package, a wrapper, or a uri
   *
   * @param options - { uri: TUri; resolutionContext?: IUriResolutionContext }
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  public async tryResolveUri(
    options: TryResolveUriOptions
  ): Promise<Result<UriPackageOrWrapper, unknown>> {
    // console.log(options.uri.uri);

    const uri = Uri.from(options.uri);

    const uriResolver = this.getResolver();

    if (uri.uri === "wrap://ens/externalenv.polywrap.eth") {
      console.log(options.resolutionContext);
    }

    const resolutionContext =
      options.resolutionContext ?? new UriResolutionContext();

    // console.log("URI RESOLVER 0", resolutionContext.getResolutionPath());

    const response = await uriResolver.tryResolveUri(
      uri,
      this,
      resolutionContext
    );

    if (uri.uri === "wrap://ens/externalenv.polywrap.eth") {
      console.log("URI RESOLVER 1", resolutionContext.getResolutionPath());
    }

    return response;
  }

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
  public async loadWrapper(
    uri: Uri,
    resolutionContext?: IUriResolutionContext,
    options?: DeserializeManifestOptions
  ): Promise<Result<Wrapper, Error>> {
    console.log(options, uri.uri, resolutionContext);
    // console.log(uri.uri);
    // console.log("LOAD 0 RESOLUTION CONTEXT", resolutionContext)
    if (uri.uri === "wrap://ens/externalenv.polywrap.eth") {
      console.log("LOAD 0 CONTEXT", resolutionContext);
    }
    if (!resolutionContext) {
      resolutionContext = new UriResolutionContext();
    }

    const result = await this.tryResolveUri({
      uri,
      resolutionContext,
    });
    if (uri.uri === "wrap://ens/externalenv.polywrap.eth") {
      console.log("LOAD 1 CONTEXT", resolutionContext);
    }

    if (!result.ok) {
      if (result.error) {
        return ResultErr(new UriResolverError(result.error, resolutionContext));
      } else {
        return ResultErr(
          Error(
            `Error resolving URI "${
              uri.uri
            }"\nResolution Stack: ${JSON.stringify(
              buildCleanUriHistory(resolutionContext.getHistory()),
              null,
              2
            )}`
          )
        );
      }
    }

    const uriPackageOrWrapper = result.value;

    if (uriPackageOrWrapper.type === "uri") {
      const error = Error(
        `Error resolving URI "${uri.uri}"\nURI not found ${
          uriPackageOrWrapper.uri.uri
        }\nResolution Stack: ${JSON.stringify(
          buildCleanUriHistory(resolutionContext.getHistory()),
          null,
          2
        )}`
      );
      return ResultErr(error);
    }

    if (uriPackageOrWrapper.type === "package") {
      const result = await uriPackageOrWrapper.package.createWrapper(options);

      if (!result.ok) {
        return result;
      }

      return ResultOk(result.value);
    } else {
      return ResultOk(uriPackageOrWrapper.wrapper);
    }
  }
}
