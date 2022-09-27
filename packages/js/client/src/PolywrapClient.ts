import {
  Wrapper,
  Client,
  ClientConfig,
  Env,
  GetFileOptions,
  GetImplementationsOptions,
  InterfaceImplementations,
  InvokeOptions,
  InvokerOptions,
  PluginRegistration,
  QueryOptions,
  SubscribeOptions,
  Subscription,
  Uri,
  UriRedirect,
  createQueryDocument,
  getImplementations,
  parseQuery,
  TryResolveUriOptions,
  IUriResolver,
  GetManifestOptions,
  IUriResolutionContext,
  UriPackageOrWrapper,
  UriResolutionContext,
  getEnvFromUriHistory,
  PluginPackage,
  QueryResult,
} from "@polywrap/core-js";
import {
  buildCleanUriHistory,
  IWrapperCache,
} from "@polywrap/uri-resolvers-js";
import { msgpackEncode, msgpackDecode } from "@polywrap/msgpack-js";
import { DeserializeManifestOptions, WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { Tracer, TracerConfig, TracingLevel } from "@polywrap/tracing-js";
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";
import { UriResolverError } from "./UriResolverError";

export interface PolywrapClientConfig<TUri extends Uri | string = string>
  extends ClientConfig<TUri> {
  tracerConfig: Partial<TracerConfig>;
  wrapperCache?: IWrapperCache;
}

export class PolywrapClient implements Client {
  private _config: PolywrapClientConfig<Uri> = ({
    redirects: [],
    plugins: [],
    interfaces: [],
    envs: [],
    tracerConfig: {},
  } as unknown) as PolywrapClientConfig<Uri>;

  constructor(
    config?: Partial<PolywrapClientConfig<string | Uri>>,
    options?: { noDefaults?: boolean }
  ) {
    try {
      this.setTracingEnabled(config?.tracerConfig);

      Tracer.startSpan("PolywrapClient: constructor");

      const builder = new ClientConfigBuilder();

      if (!options?.noDefaults) {
        builder.addDefaults(config?.wrapperCache);
      }

      if (config) {
        builder.add(config);
      }

      const sanitizedConfig = builder.build();

      this._config = {
        ...sanitizedConfig,
        tracerConfig: {
          consoleEnabled: !!config?.tracerConfig?.consoleEnabled,
          consoleDetailed: config?.tracerConfig?.consoleDetailed,
          httpEnabled: !!config?.tracerConfig?.httpEnabled,
          httpUrl: config?.tracerConfig?.httpUrl,
          tracingLevel: config?.tracerConfig?.tracingLevel,
        },
      };

      this._validateConfig();

      Tracer.setAttribute("config", this._config);
    } catch (error) {
      Tracer.recordException(error);
      throw error;
    } finally {
      Tracer.endSpan();
    }
  }

  public getConfig(): PolywrapClientConfig<Uri> {
    return this._config;
  }

  public setTracingEnabled(tracerConfig?: Partial<TracerConfig>): void {
    if (tracerConfig?.consoleEnabled || tracerConfig?.httpEnabled) {
      Tracer.enableTracing("PolywrapClient", tracerConfig);
    } else {
      Tracer.disableTracing();
    }
    this._config.tracerConfig = tracerConfig ?? {};
  }

  @Tracer.traceMethod("PolywrapClient: getRedirects")
  public getRedirects(): readonly UriRedirect<Uri>[] {
    return this._config.redirects;
  }

  @Tracer.traceMethod("PolywrapClient: getPlugins")
  public getPlugins(): readonly PluginRegistration<Uri>[] {
    return this._config.plugins;
  }

  @Tracer.traceMethod("PolywrapClient: getPlugin")
  public getPluginByUri<TUri extends Uri | string>(
    uri: TUri
  ): PluginPackage<unknown> | undefined {
    return this.getPlugins().find((x) => Uri.equals(x.uri, Uri.from(uri)))
      ?.plugin;
  }

  @Tracer.traceMethod("PolywrapClient: getInterfaces")
  public getInterfaces(): readonly InterfaceImplementations<Uri>[] {
    return this._config.interfaces;
  }

  @Tracer.traceMethod("PolywrapClient: getEnvs")
  public getEnvs(): readonly Env<Uri>[] {
    return this._config.envs;
  }

  @Tracer.traceMethod("PolywrapClient: getUriResolver")
  public getUriResolver(): IUriResolver<unknown> {
    return this._config.resolver;
  }

  @Tracer.traceMethod("PolywrapClient: getEnvByUri")
  public getEnvByUri<TUri extends Uri | string>(
    uri: TUri
  ): Env<Uri> | undefined {
    const uriUri = Uri.from(uri);

    return this.getEnvs().find((environment) =>
      Uri.equals(environment.uri, uriUri)
    );
  }

  @Tracer.traceMethod("PolywrapClient: getManifest")
  public async getManifest<TUri extends Uri | string>(
    uri: TUri,
    options: GetManifestOptions = {}
  ): Promise<Result<WrapManifest, Error>> {
    const load = await this.loadWrapper(Uri.from(uri), undefined);
    if (!load.ok) {
      return load;
    }
    const wrapper = load.value;
    const manifest = wrapper.getManifest(options, this);
    return ResultOk(manifest);
  }

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
    return await wrapper.getFile(options, this);
  }

  @Tracer.traceMethod("PolywrapClient: getImplementations")
  public getImplementations<TUri extends Uri | string>(
    uri: TUri,
    options: GetImplementationsOptions = {}
  ): Result<TUri[], Error> {
    const isUriTypeString = typeof uri === "string";
    const applyRedirects = !!options.applyRedirects;

    const getImplResult = getImplementations(
      Uri.from(uri),
      this.getInterfaces(),
      applyRedirects ? this.getRedirects() : undefined
    );

    if (!getImplResult.ok) {
      return getImplResult;
    }

    const uris = isUriTypeString
      ? (getImplResult.value.map((x: Uri) => x.uri) as TUri[])
      : (getImplResult.value as TUri[]);

    return ResultOk(uris);
  }

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
        result: Result<unknown, Error>;
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

  @Tracer.traceMethod("PolywrapClient: invokeWrapper")
  public async invokeWrapper<
    TData = unknown,
    TUri extends Uri | string = string
  >(
    options: InvokerOptions<TUri> & { wrapper: Wrapper }
  ): Promise<Result<TData, Error>> {
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

  @Tracer.traceMethod("PolywrapClient: invoke")
  public async invoke<TData = unknown, TUri extends Uri | string = string>(
    options: InvokerOptions<TUri>
  ): Promise<Result<TData, Error>> {
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
        return ResultErr(loadWrapperResult.error);
      }
      const wrapper = loadWrapperResult.value;

      const env = getEnvFromUriHistory(
        resolutionContext.getResolutionPath(),
        this
      );

      const invokeResult = await this.invokeWrapper<TData, Uri>({
        env: env?.env,
        ...typedOptions,
        wrapper,
      });

      if (!invokeResult.ok) {
        return ResultErr(invokeResult.error);
      }

      return invokeResult;
    } catch (error) {
      return ResultErr(error);
    }
  }

  @Tracer.traceMethod("PolywrapClient: subscribe")
  public subscribe<TData = unknown, TUri extends Uri | string = string>(
    options: SubscribeOptions<TUri>
  ): Subscription<TData> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const thisClient: PolywrapClient = this;

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
      async *[Symbol.asyncIterator](): AsyncGenerator<Result<TData, Error>> {
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

  @Tracer.traceMethod("PolywrapClient: tryResolveUri", TracingLevel.High)
  public async tryResolveUri<TUri extends Uri | string>(
    options: TryResolveUriOptions<TUri>
  ): Promise<Result<UriPackageOrWrapper, unknown>> {
    const uri = Uri.from(options.uri);

    const uriResolver = this.getUriResolver();

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
      const result = await uriPackageOrWrapper.package.createWrapper();

      if (!result.ok) {
        return result;
      }

      return ResultOk(result.value);
    } else {
      return ResultOk(uriPackageOrWrapper.wrapper);
    }
  }

  @Tracer.traceMethod("PolywrapClient: validateConfig")
  private _validateConfig(): void {
    // Require plugins to use non-interface URIs
    const pluginUris = this.getPlugins().map((x) => x.uri.uri);
    const interfaceUris = this.getInterfaces().map((x) => x.interface.uri);

    const pluginsWithInterfaceUris = pluginUris.filter((plugin) =>
      interfaceUris.includes(plugin)
    );

    if (pluginsWithInterfaceUris.length) {
      throw Error(
        `Plugins can't use interfaces for their URI. Invalid plugins: ${pluginsWithInterfaceUris}`
      );
    }
  }
}
