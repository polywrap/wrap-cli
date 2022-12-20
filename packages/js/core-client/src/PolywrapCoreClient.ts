import { UriResolverError } from "./UriResolverError";
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
  QueryOptions,
  SubscribeOptions,
  Subscription,
  Uri,
  createQueryDocument,
  getImplementations,
  parseQuery,
  TryResolveUriOptions,
  IUriResolver,
  IUriResolutionContext,
  UriPackageOrWrapper,
  UriResolutionContext,
  getEnvFromUriHistory,
  QueryResult,
  InvokeResult,
  ValidateOptions,
  buildCleanUriHistory,
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

  /**
   * Instantiate a PolywrapClient
   *
   * @param config - a core client configuration
   */
  constructor(config: PolywrapCoreClientConfig) {
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

  /**
   * Returns the configuration used to instantiate the client
   *
   * @returns an immutable Polywrap client config
   */
  public getConfig(): PolywrapCoreClientConfig<Uri> {
    return this._config;
  }

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
    if (tracerConfig?.consoleEnabled || tracerConfig?.httpEnabled) {
      Tracer.enableTracing("PolywrapClient", tracerConfig);
    } else {
      Tracer.disableTracing();
    }
  }

  /**
   * returns all interfaces from the configuration used to instantiate the client
   *
   * @returns an array of interfaces and their registered implementations
   */
  @Tracer.traceMethod("PolywrapClient: getInterfaces")
  public getInterfaces(): readonly InterfaceImplementations<Uri>[] | undefined {
    return this._config.interfaces;
  }

  /**
   * returns all env registrations from the configuration used to instantiate the client
   *
   * @returns an array of env objects containing wrapper environmental variables
   */
  @Tracer.traceMethod("PolywrapClient: getEnvs")
  public getEnvs(): readonly Env<Uri>[] | undefined {
    return this._config.envs;
  }

  /**
   * returns the URI resolver from the configuration used to instantiate the client
   *
   * @returns an object that implements the IUriResolver interface
   */
  @Tracer.traceMethod("PolywrapClient: getUriResolver")
  public getResolver(): IUriResolver<unknown> {
    return this._config.resolver;
  }

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
   * @returns a Result containing the WrapManifest if the request was successful
   */
  @Tracer.traceMethod("PolywrapClient: getManifest")
  public async getManifest<TUri extends Uri | string>(
    uri: TUri
  ): Promise<Result<WrapManifest, Error>> {
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
  @Tracer.traceMethod("PolywrapClient: getFile")
  public async getFile<TUri extends Uri | string>(
    uri: TUri,
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
  @Tracer.traceMethod("PolywrapClient: getImplementations")
  public async getImplementations<TUri extends Uri | string>(
    uri: TUri,
    options: GetImplementationsOptions = {}
  ): Promise<Result<TUri[], Error>> {
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
  @Tracer.traceMethod("PolywrapClient: query", TracingLevel.High)
  public async query<
    TData extends Record<string, unknown> = Record<string, unknown>,
    TVariables extends Record<string, unknown> = Record<string, unknown>,
    TUri extends Uri | string = string
  >(options: QueryOptions<TVariables, TUri>): Promise<QueryResult<TData>> {
    let result: QueryResult<TData>;

    err: try {
      const typedOptions: QueryOptions<TVariables, Uri> = {
        ...options,
        uri: Uri.from(options.uri),
      };

      const { uri, query, variables } = typedOptions;

      // Convert the query string into a query document
      const queryDocument =
        typeof query === "string" ? createQueryDocument(query) : query;

      // Parse the query to understand what's being invoked
      const parseResult = parseQuery(uri, queryDocument, variables);
      if (!parseResult.ok) {
        result = { errors: [parseResult.error as Error] };
        break err;
      }
      const queryInvocations = parseResult.value;

      // Execute all invocations in parallel
      const parallelInvocations: Promise<{
        name: string;
        result: InvokeResult<unknown>;
      }>[] = [];

      for (const invocationName of Object.keys(queryInvocations)) {
        parallelInvocations.push(
          this.invoke({
            ...queryInvocations[invocationName],
            uri: queryInvocations[invocationName].uri,
          }).then((result) => ({
            name: invocationName,
            result,
          }))
        );
      }

      // Await the invocations
      const invocationResults = await Promise.all(parallelInvocations);

      Tracer.addEvent("invocationResults", invocationResults);

      // Aggregate all invocation results
      const data: Record<string, unknown> = {};
      const errors: Error[] = [];

      for (const invocation of invocationResults) {
        if (invocation.result.ok) {
          data[invocation.name] = invocation.result.value;
        } else {
          errors.push(invocation.result.error as Error);
        }
      }

      result = {
        data: data as TData,
        errors: errors.length === 0 ? undefined : errors,
      };
    } catch (error: unknown) {
      if (Array.isArray(error)) {
        result = { errors: error };
      } else {
        result = { errors: [error as Error] };
      }
    }

    return result;
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
  @Tracer.traceMethod("PolywrapClient: invokeWrapper")
  public async invokeWrapper<
    TData = unknown,
    TUri extends Uri | string = string
  >(
    options: InvokerOptions<TUri> & { wrapper: Wrapper }
  ): Promise<InvokeResult<TData>> {
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
  @Tracer.traceMethod("PolywrapClient: subscribe")
  public subscribe<TData = unknown, TUri extends Uri | string = string>(
    options: SubscribeOptions<TUri>
  ): Subscription<TData> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const thisClient: PolywrapCoreClient = this;

    const typedOptions: SubscribeOptions<Uri> = {
      ...options,
      uri: Uri.from(options.uri),
    };
    const { uri, method, args, frequency: freq } = typedOptions;

    // calculate interval between invokes, in milliseconds, 1 min default value
    /* eslint-disable prettier/prettier */
    let frequency: number;
    if (freq && (freq.ms || freq.sec || freq.min || freq.hours)) {
      frequency =
        (freq.ms ?? 0) +
        ((freq.hours ?? 0) * 3600 + (freq.min ?? 0) * 60 + (freq.sec ?? 0)) *
          1000;
    } else {
      frequency = 60000;
    }
    /* eslint-enable  prettier/prettier */

    const subscription: Subscription<TData> = {
      frequency: frequency,
      isActive: false,
      stop(): void {
        subscription.isActive = false;
      },
      async *[Symbol.asyncIterator](): AsyncGenerator<InvokeResult<TData>> {
        let timeout: NodeJS.Timeout | undefined = undefined;
        subscription.isActive = true;

        try {
          let readyVals = 0;
          let sleep: ((value?: unknown) => void) | undefined;

          timeout = setInterval(() => {
            readyVals++;
            if (sleep) {
              sleep();
              sleep = undefined;
            }
          }, frequency);

          while (subscription.isActive) {
            if (readyVals === 0) {
              await new Promise((r) => (sleep = r));
            }

            for (; readyVals > 0; readyVals--) {
              if (!subscription.isActive) {
                break;
              }

              const result = await thisClient.invoke<TData, Uri>({
                uri: uri,
                method: method,
                args: args,
              });

              yield result;
            }
          }
        } finally {
          if (timeout) {
            clearInterval(timeout);
          }
          subscription.isActive = false;
        }
      },
    };

    return subscription;
  }

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
   * @returns A Promise with a Result containing a Wrapper or Error
   */
  @Tracer.traceMethod("PolywrapClient: loadWrapper", TracingLevel.High)
  public async loadWrapper(
    uri: Uri,
    resolutionContext?: IUriResolutionContext,
    options?: DeserializeManifestOptions
  ): Promise<Result<Wrapper, Error>> {
    Tracer.setAttribute("label", `Wrapper loaded: ${uri}`, TracingLevel.High);

    if (!resolutionContext) {
      resolutionContext = new UriResolutionContext();
    }

    const result = await this.tryResolveUri({
      uri,
      resolutionContext,
    });

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

  /**
   * Validate a wrapper, given a URI.
   * Optionally, validate the full ABI and/or recursively validate imports.
   *
   * @param uri: the Uri to resolve
   * @param options - { abi?: boolean; recursive?: boolean }
   * @returns A Promise with a Result containing a boolean or Error
   */
  @Tracer.traceMethod("PolywrapClient: validateConfig")
  public async validate<TUri extends Uri | string>(
    uri: TUri,
    options: ValidateOptions
  ): Promise<Result<true, Error>> {
    const wrapper = await this.loadWrapper(Uri.from(uri));
    if (!wrapper.ok) {
      return ResultErr(new Error(wrapper.error?.message));
    }

    const { abi } = await wrapper.value.getManifest();
    const importedModules: ImportedModuleDefinition[] =
      abi.importedModuleTypes || [];

    const importUri = (importedModuleType: ImportedModuleDefinition) => {
      return this.tryResolveUri({ uri: importedModuleType.uri });
    };
    const resolvedModules = await Promise.all(importedModules.map(importUri));
    const modulesNotFound = resolvedModules.filter(({ ok }) => !ok) as {
      error: Error;
    }[];

    if (modulesNotFound.length) {
      const missingModules = modulesNotFound.map(({ error }) => {
        const uriIndex = error?.message.indexOf("\n");
        return error?.message.substring(0, uriIndex);
      });
      const error = new Error(JSON.stringify(missingModules));
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

        const errorMessage = `ABI from Uri: ${importedModule.uri} is not compatible with Uri: ${uri}`;
        for (const [i, _] of Object.keys(importedMethods).entries()) {
          const importedMethod = importedMethods[i];

          if (expectedMethods?.methods && expectedMethods?.methods.length < i) {
            const expectedMethod = expectedMethods?.methods[i];
            const areEqual = compareSignature(importedMethod, expectedMethod);

            if (!areEqual) return ResultErr(new Error(errorMessage));
          } else {
            return ResultErr(new Error(errorMessage));
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
        error: Error;
      }[];
      if (invalidUris.length) {
        const missingUris = invalidUris.map(({ error }) => {
          const uriIndex = error?.message.indexOf("\n");
          return error?.message.substring(0, uriIndex);
        });
        const error = new Error(JSON.stringify(missingUris));
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
