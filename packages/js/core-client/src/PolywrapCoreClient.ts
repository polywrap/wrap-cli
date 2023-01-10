import { PolywrapCoreClientConfig } from "./PolywrapCoreClientConfig";

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
  ValidateOptions,
  buildCleanUriHistory,
  WrapError,
  WrapErrorCode,
} from "@polywrap/core-js";
import { msgpackEncode, msgpackDecode } from "@polywrap/msgpack-js";
import {
  compareSignature,
  DeserializeManifestOptions,
  WrapManifest,
  ImportedModuleDefinition,
} from "@polywrap/wrap-manifest-types-js";
import { Tracer, TracerConfig, TracingLevel } from "@polywrap/tracing-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";

export class PolywrapCoreClient implements CoreClient {
  private _config: PolywrapCoreClientConfig<Uri>;

  // $start: PolywrapCoreClient-constructor
  /**
   * Instantiate a PolywrapClient
   *
   * @param config - a core client configuration
   */
  constructor(config: PolywrapCoreClientConfig) /* $ */ {
    try {
      this.setTracingEnabled(config?.tracerConfig);

      Tracer.startSpan("PolywrapClient: constructor");

      this._config = this.buildConfigFromPolywrapCoreClientConfig(config);

      Tracer.setAttribute("config", this._config);
    } catch (error) {
      Tracer.recordException(error);
      throw error;
    } finally {
      Tracer.endSpan();
    }
  }

  // $start: PolywrapCoreClient-getConfig
  /**
   * Returns the configuration used to instantiate the client
   *
   * @returns an immutable Polywrap client config
   */
  public getConfig(): PolywrapCoreClientConfig<Uri> /* $ */ {
    return this._config;
  }

  // $start: PolywrapCoreClient-setTracingEnabled
  /**
   * Enable tracing for intricate debugging
   *
   * @remarks
   * Tracing uses the @polywrap/tracing-js package
   *
   * @param tracerConfig - configure options such as the tracing level
   * @returns void
   */
  public setTracingEnabled(tracerConfig?: Partial<TracerConfig>): void /* $ */ {
    if (tracerConfig?.consoleEnabled || tracerConfig?.httpEnabled) {
      Tracer.enableTracing("PolywrapClient", tracerConfig);
    } else {
      Tracer.disableTracing();
    }
  }

  // $start: PolywrapCoreClient-getInterfaces
  /**
   * returns all interfaces from the configuration used to instantiate the client
   *
   * @returns an array of interfaces and their registered implementations
   */
  @Tracer.traceMethod("PolywrapClient: getInterfaces")
  public getInterfaces(): readonly InterfaceImplementations<Uri>[] | undefined /* $ */ { // eslint-disable-line
    return this._config.interfaces;
  }

  // $start: PolywrapCoreClient-getEnvs
  /**
   * returns all env registrations from the configuration used to instantiate the client
   *
   * @returns an array of env objects containing wrapper environmental variables
   */
  @Tracer.traceMethod("PolywrapClient: getEnvs")
  public getEnvs(): readonly Env<Uri>[] | undefined /* $ */ {
    return this._config.envs;
  }

  // $start: PolywrapCoreClient-getResolver
  /**
   * returns the URI resolver from the configuration used to instantiate the client
   *
   * @returns an object that implements the IUriResolver interface
   */
  @Tracer.traceMethod("PolywrapClient: getUriResolver")
  public getResolver(): IUriResolver<unknown> /* $ */ {
    return this._config.resolver;
  }

  // $start: PolywrapCoreClient-getEnvByUri
  /**
   * returns an env (a set of environmental variables) from the configuration used to instantiate the client
   *
   * @param uri - the URI used to register the env
   * @returns an env, or undefined if an env is not found at the given URI
   */
  @Tracer.traceMethod("PolywrapClient: getEnvByUri")
  public getEnvByUri<TUri extends Uri | string>(
    uri: TUri
  ): Env<Uri> | undefined /* $ */ {
    const uriUri = Uri.from(uri);

    const envs = this.getEnvs();
    if (!envs) {
      return undefined;
    }

    return envs.find((environment) => Uri.equals(environment.uri, uriUri));
  }

  // $start: PolywrapCoreClient-getManifest
  /**
   * returns a package's wrap manifest
   *
   * @param uri - a wrap URI
   * @returns a Result containing the WrapManifest if the request was successful
   */
  @Tracer.traceMethod("PolywrapClient: getManifest")
  public async getManifest<TUri extends Uri | string>(
    uri: TUri
  ): Promise<Result<WrapManifest, WrapError>> /* $ */ {
    const load = await this.loadWrapper(Uri.from(uri), undefined);
    if (!load.ok) {
      return load;
    }
    const wrapper = load.value;
    const manifest = wrapper.getManifest();

    return ResultOk(manifest);
  }

  // $start: PolywrapCoreClient-getFile
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
  ): Promise<Result<string | Uint8Array, WrapError>> /* $ */ {
    const load = await this.loadWrapper(Uri.from(uri), undefined);
    if (!load.ok) {
      return load;
    }
    const wrapper = load.value;

    const result = await wrapper.getFile(options);
    if (!result.ok) {
      const error = new WrapError(result.error?.message, {
        code: WrapErrorCode.CLIENT_GET_FILE_ERROR,
        uri: uri.toString(),
      });
      return ResultErr(error);
    }
    return ResultOk(result.value);
  }

  // $start: PolywrapCoreClient-getImplementations
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
  ): Promise<Result<TUri[], WrapError>> /* $ */ {
    const isUriTypeString = typeof uri === "string";
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

    const uris = isUriTypeString
      ? (getImplResult.value.map((x: Uri) => x.uri) as TUri[])
      : (getImplResult.value as TUri[]);

    return ResultOk(uris);
  }

  // $start: PolywrapCoreClient-invokeWrapper
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
  @Tracer.traceMethod("PolywrapClient: invokeWrapper")
  public async invokeWrapper<
    TData = unknown,
    TUri extends Uri | string = string
  >(
    options: InvokerOptions<TUri> & { wrapper: Wrapper }
  ): Promise<InvokeResult<TData>> /* $ */ {
    try {
      const typedOptions: InvokeOptions<Uri> = {
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

  // $start: PolywrapCoreClient-invoke
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
  @Tracer.traceMethod("PolywrapClient: invoke")
  public async invoke<TData = unknown, TUri extends Uri | string = string>(
    options: InvokerOptions<TUri>
  ): Promise<InvokeResult<TData>> /* $ */ {
    try {
      const typedOptions: InvokeOptions<Uri> = {
        ...options,
        uri: Uri.from(options.uri),
      };

      const resolutionContext =
        options.resolutionContext ?? new UriResolutionContext();

      const loadWrapperResult = await this.loadWrapper(
        typedOptions.uri,
        resolutionContext
      );

      if (!loadWrapperResult.ok) {
        return loadWrapperResult;
      }
      const wrapper = loadWrapperResult.value;

      const resolutionPath = resolutionContext.getResolutionPath();
      const env = getEnvFromUriHistory(
        resolutionPath.length > 0 ? resolutionPath : [typedOptions.uri],
        this
      );

      const invokeResult = await this.invokeWrapper<TData, Uri>({
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

  // $start: PolywrapCoreClient-tryResolveUri
  /**
   * Resolve a URI to a wrap package, a wrapper, or a uri
   *
   * @param options - { uri: TUri; resolutionContext?: IUriResolutionContext }
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  @Tracer.traceMethod("PolywrapClient: tryResolveUri", TracingLevel.High)
  public async tryResolveUri<TUri extends Uri | string>(
    options: TryResolveUriOptions<TUri>
  ): Promise<Result<UriPackageOrWrapper, unknown>> /* $ */ {
    const uri = Uri.from(options.uri);

    const uriResolver = this.getResolver();

    const resolutionContext =
      options.resolutionContext ?? new UriResolutionContext();

    const response = await uriResolver.tryResolveUri(
      uri,
      this,
      resolutionContext
    );

    if (options.resolutionContext) {
      Tracer.setAttribute(
        "label",
        buildCleanUriHistory(options.resolutionContext.getHistory()),
        TracingLevel.High
      );
    }

    return response;
  }

  // $start: PolywrapCoreClient-loadWrapper
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
  ): Promise<Result<Wrapper, WrapError>> /* $ */ {
    Tracer.setAttribute("label", `Wrapper loaded: ${uri}`, TracingLevel.High);

    if (!resolutionContext) {
      resolutionContext = new UriResolutionContext();
    }

    const result = await this.tryResolveUri({
      uri,
      resolutionContext,
    });

    if (!result.ok) {
      const history = buildCleanUriHistory(resolutionContext.getHistory());

      let error: WrapError;
      if (result.error) {
        error = new WrapError("A URI Resolver returned an error.", {
          code: WrapErrorCode.URI_RESOLVER_ERROR,
          uri: uri.uri,
          resolutionStack: history,
          cause: result.error,
        });
      } else {
        error = new WrapError("Error resolving URI", {
          code: WrapErrorCode.URI_RESOLUTION_ERROR,
          uri: uri.uri,
          resolutionStack: history,
        });
      }

      return ResultErr(error);
    }

    const uriPackageOrWrapper = result.value;

    if (uriPackageOrWrapper.type === "uri") {
      const message = `Unable to find URI ${uriPackageOrWrapper.uri.uri}.`;
      const history = buildCleanUriHistory(resolutionContext.getHistory());
      const error = new WrapError(message, {
        code: WrapErrorCode.URI_NOT_FOUND,
        uri: uri.uri,
        resolutionStack: history,
      });
      return ResultErr(error);
    }

    if (uriPackageOrWrapper.type === "package") {
      const result = await uriPackageOrWrapper.package.createWrapper(options);

      if (!result.ok) {
        const error = new WrapError(result.error?.message, {
          code: WrapErrorCode.CLIENT_LOAD_WRAPPER_ERROR,
          uri: uri.uri,
          cause: result.error,
        });
        return ResultErr(error);
      }

      return ResultOk(result.value);
    } else {
      return ResultOk(uriPackageOrWrapper.wrapper);
    }
  }

  // $start: PolywrapCoreClient-validate
  /**
   * Validate a wrapper, given a URI.
   * Optionally, validate the full ABI and/or recursively validate imports.
   *
   * @param uri - the Uri to resolve
   * @param options - { abi?: boolean; recursive?: boolean }
   * @returns A Promise with a Result containing a boolean or Error
   */
  @Tracer.traceMethod("PolywrapClient: validate")
  public async validate<TUri extends Uri | string>(
    uri: TUri,
    options: ValidateOptions
  ): Promise<Result<true, WrapError>> /* $ */ {
    const wrapper = await this.loadWrapper(Uri.from(uri));
    if (!wrapper.ok) {
      return wrapper;
    }

    const { abi } = await wrapper.value.getManifest();
    const importedModules: ImportedModuleDefinition[] =
      abi.importedModuleTypes || [];

    const importUri = async (
      importedModuleType: ImportedModuleDefinition
    ): Promise<{
      uri: string;
      result: Result<UriPackageOrWrapper, unknown>;
    }> => {
      const uri = importedModuleType.uri;
      return {
        uri,
        result: await this.tryResolveUri({ uri }),
      };
    };
    const resolvedModules = await Promise.all(importedModules.map(importUri));
    const modulesNotFound = resolvedModules
      .filter(({ result }) => !result.ok)
      .map(({ uri }) => uri);

    if (modulesNotFound.length) {
      const message = `The following URIs could not be resolved: ${modulesNotFound}`;
      const error = new WrapError(message, {
        code: WrapErrorCode.CLIENT_VALIDATE_RESOLUTION_FAIL,
        uri: uri.toString(),
      });
      return ResultErr(error);
    }

    if (options.abi) {
      for (const importedModule of importedModules) {
        const importedModuleManifest = await this.getManifest(
          importedModule.uri
        );
        if (!importedModuleManifest.ok) {
          return ResultErr(importedModuleManifest.error);
        }
        const importedMethods =
          importedModuleManifest.value.abi.moduleType?.methods || [];

        const expectedMethods = importedModules.find(
          ({ uri }) => importedModule.uri === uri
        );

        for (const [i, _] of Object.keys(importedMethods).entries()) {
          const importedMethod = importedMethods[i];

          if (expectedMethods?.methods && expectedMethods?.methods.length < i) {
            const expectedMethod = expectedMethods?.methods[i];
            const areEqual = compareSignature(importedMethod, expectedMethod);

            if (!areEqual) {
              const message = `ABI from Uri: ${importedModule.uri} is not compatible with Uri: ${uri}`;
              const error = new WrapError(message, {
                code: WrapErrorCode.CLIENT_VALIDATE_ABI_FAIL,
                uri: uri.toString(),
              });
              return ResultErr(error);
            }
          } else {
            const message = `ABI from Uri: ${importedModule.uri} is not compatible with Uri: ${uri}`;
            const error = new WrapError(message, {
              code: WrapErrorCode.CLIENT_VALIDATE_ABI_FAIL,
              uri: uri.toString(),
            });
            return ResultErr(error);
          }
        }
      }
    }

    if (options.recursive) {
      const validateImportedModules = importedModules.map(({ uri }) =>
        this.validate(uri, options)
      );
      const resolverUris = await Promise.all(validateImportedModules);
      const invalidUris = resolverUris.filter(({ ok }) => !ok) as {
        error: WrapError;
      }[];

      if (invalidUris.length) {
        let message = "The following URIs failed validation:";
        for (const { error } of invalidUris) {
          message += `\n${error.uri} -> ${error.reason}`;
        }
        const error = new WrapError(message, {
          code: WrapErrorCode.CLIENT_VALIDATE_RECURSIVE_FAIL,
          uri: uri.toString(),
        });
        return ResultErr(error);
      }
    }
    return ResultOk(true);
  }

  private buildConfigFromPolywrapCoreClientConfig(
    config: PolywrapCoreClientConfig
  ): PolywrapCoreClientConfig<Uri> {
    return {
      interfaces:
        config?.interfaces?.map((x) => ({
          interface: Uri.from(x.interface),
          implementations: x.implementations.map((y) => Uri.from(y)),
        })) ?? [],
      envs:
        config?.envs?.map((x) => ({
          uri: Uri.from(x.uri),
          env: x.env,
        })) ?? [],
      resolver: config.resolver,
      tracerConfig: {
        consoleEnabled: !!config?.tracerConfig?.consoleEnabled,
        consoleDetailed: config?.tracerConfig?.consoleDetailed,
        httpEnabled: !!config?.tracerConfig?.httpEnabled,
        httpUrl: config?.tracerConfig?.httpUrl,
        tracingLevel: config?.tracerConfig?.tracingLevel,
      },
    };
  }
}
