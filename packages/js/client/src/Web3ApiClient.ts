import { getDefaultClientConfig } from "./default-client-config";
import { PluginWeb3Api } from "./plugin/PluginWeb3Api";
import { WasmWeb3Api } from "./wasm";

import { v4 as uuid } from "uuid";
import {
  Api,
  ApiCache,
  Client,
  InvokeApiOptions,
  InvokeApiResult,
  PluginPackage,
  QueryApiOptions,
  QueryApiResult,
  Uri,
  UriRedirect,
  InterfaceImplementations,
  PluginRegistration,
  Web3ApiManifest,
  Subscription,
  SubscribeOptions,
  parseQuery,
  resolveUri,
  AnyManifest,
  ManifestType,
  GetImplementationsOptions,
  GetManifestOptions,
  GetFileOptions,
  createQueryDocument,
  getImplementations,
  sanitizeInterfaceImplementations,
  sanitizePluginRegistrations,
  sanitizeUriRedirects,
  ClientConfig,
} from "@web3api/core-js";
import { Tracer } from "@web3api/tracing-js";

export { WasmWeb3Api };

export interface Web3ApiClientConfig<
  TUri extends Uri | string = string
> extends ClientConfig<TUri> {
  tracingEnabled: boolean;
}

export class Web3ApiClient implements Client {
  // TODO: the API cache needs to be more like a routing table.
  // It should help us keep track of what URI's map to what APIs,
  // and handle cases where the are multiple jumps. For example, if
  // A => B => C, then the cache should have A => C, and B => C.
  private _apiCache: ApiCache = new Map<string, Api>();
  private _config: Web3ApiClientConfig<Uri> = {
    redirects: [],
    plugins: [],
    interfaces: [],
    tracingEnabled: false,
  };
  private _overrides: Map<string, ClientConfig<Uri>> = new Map();

  constructor(config?: Partial<Web3ApiClientConfig>) {
    try {
      this.tracingEnabled(!!config?.tracingEnabled);

      Tracer.startSpan("Web3ApiClient: constructor");

      if (config) {
        this._config = {
          redirects: config.redirects
            ? sanitizeUriRedirects(config.redirects)
            : [],
          plugins: config.plugins
            ? sanitizePluginRegistrations(config.plugins)
            : [],
          interfaces: config.interfaces
            ? sanitizeInterfaceImplementations(config.interfaces)
            : [],
          tracingEnabled: !!config.tracingEnabled,
        };
      }

      // Add the default config
      const defaultClientConfig = getDefaultClientConfig();

      if (defaultClientConfig.redirects) {
        this._config.redirects.push(...defaultClientConfig.redirects);
      }

      if (defaultClientConfig.plugins) {
        this._config.plugins.push(...defaultClientConfig.plugins);
      }

      if (defaultClientConfig.interfaces) {
        this._config.interfaces.push(...defaultClientConfig.interfaces);
      }

      this._requirePluginsToUseNonInterfaceUris();

      Tracer.setAttribute("config", this._config);
    } catch (error) {
      Tracer.recordException(error);
      throw error;
    } finally {
      Tracer.endSpan();
    }
  }

  public tracingEnabled(enable: boolean): void {
    if (enable) {
      Tracer.enableTracing("Web3ApiClient");
    } else {
      Tracer.disableTracing();
    }
    this._config.tracingEnabled = enable;
  }

  public getInvokeContext(id: string): ClientConfig<Uri> {
    const context = this._overrides.get(id);
    if (!context) {
      throw new Error(`No invoke context found with id: ${id}`);
    }

    return context;
  }

  public redirects(): readonly UriRedirect<Uri>[] {
    return this._config.redirects || [];
  }

  public plugins(): readonly PluginRegistration<Uri>[] {
    return this._config.plugins || [];
  }

  public interfaces(): readonly InterfaceImplementations<Uri>[] {
    return this._config.interfaces || [];
  }

  public async getSchema<TUri extends Uri | string>(
    uri: TUri
  ): Promise<string> {
    const api = await this._loadWeb3Api(this._toUri(uri));
    return await api.getSchema(this);
  }

  public async getManifest<
    TUri extends Uri | string,
    TManifestType extends ManifestType
  >(
    uri: TUri,
    options: GetManifestOptions<TManifestType>
  ): Promise<AnyManifest<TManifestType>> {
    const api = await this._loadWeb3Api(this._toUri(uri));
    return await api.getManifest(options, this);
  }

  public async getFile<TUri extends Uri | string>(
    uri: TUri,
    options: GetFileOptions
  ): Promise<string | ArrayBuffer> {
    const api = await this._loadWeb3Api(this._toUri(uri));
    return await api.getFile(options, this);
  }

  public getImplementations<TUri extends Uri | string>(
    uri: TUri,
    options?: GetImplementationsOptions
  ): TUri[] {
    const isUriTypeString = typeof uri === "string";

    const run = Tracer.traceFunc(
      "Web3ApiClient: getImplementations",
      (): TUri[] => {
        const applyRedirects = !!options?.applyRedirects;

        return isUriTypeString
          ? (getImplementations(
              this._toUri(uri),
              this.interfaces(),
              applyRedirects ? this.redirects() : undefined
            ).map((x: Uri) => x.uri) as TUri[])
          : (getImplementations(
              this._toUri(uri),
              this.interfaces(),
              applyRedirects ? this.redirects() : undefined
            ) as TUri[]);
      }
    );

    return run();
  }

  @Tracer.traceMethod("Web3ApiClient: query")
  public async query<
    TData extends Record<string, unknown> = Record<string, unknown>,
    TVariables extends Record<string, unknown> = Record<string, unknown>,
    TUri extends Uri | string = string
  >(
    options: QueryApiOptions<TVariables, TUri>
  ): Promise<QueryApiResult<TData>> {
    const typedOptions: QueryApiOptions<TVariables, Uri> = {
      ...options,
      uri: this._toUri(options.uri),
    };

    let result: QueryApiResult<TData>;
    let overwrittenConfig: Partial<ClientConfig<Uri>> | undefined;

    // This will allow us to also receive custom plugins + interfaces
    if (options.overrides) {
      const overwrittenRedirects = options.overrides.redirects;
      if (overwrittenRedirects && overwrittenRedirects.length) {
        // eslint-disable-next-line
        overwrittenConfig = {
          redirects: sanitizeUriRedirects(overwrittenRedirects),
        };
      }
    }

    const { id: queryId, shouldClearContext } = this.setInvokeContext(
      options.id,
      overwrittenConfig
    );

    const run = Tracer.traceFunc(
      "Web3ApiClient: query",
      async (
        options: QueryApiOptions<TVariables, Uri>
      ): Promise<QueryApiResult<TData>> => {
        const { uri, query, variables } = options;

        // Convert the query string into a query document
        const queryDocument =
          typeof query === "string" ? createQueryDocument(query) : query;

        // Parse the query to understand what's being invoked
        const queryInvocations = parseQuery(uri, queryDocument, variables);

        // Execute all invocations in parallel
        const parallelInvocations: Promise<{
          name: string;
          result: InvokeApiResult<unknown>;
        }>[] = [];

        for (const invocationName of Object.keys(queryInvocations)) {
          parallelInvocations.push(
            this.invoke({
              ...queryInvocations[invocationName],
              uri: queryInvocations[invocationName].uri,
              decode: true,
              id: queryId,
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
          data[invocation.name] = invocation.result.data;
          if (invocation.result.error) {
            errors.push(invocation.result.error);
          }
        }

        result = {
          data: data as TData,
          errors: errors.length === 0 ? undefined : errors,
        };
        return result;
      }
    );

    try {
      result = await run(typedOptions);
    } catch (error) {
      if (Array.isArray(error)) {
        result = { errors: error };
      } else {
        result = { errors: [error] };
      }
    }

    if (shouldClearContext) {
      this.clearInvokeContext(queryId);
    }
    return result;
  }

  @Tracer.traceMethod("Web3ApiClient: invoke")
  public async invoke<TData = unknown, TUri extends Uri | string = string>(
    options: InvokeApiOptions<TUri>
  ): Promise<InvokeApiResult<TData>> {
    const { id: invokeId, shouldClearContext } = this.setInvokeContext(
      options.id,
      options.overrides
    );

    const typedOptions: InvokeApiOptions<Uri> = {
      ...options,
      uri: this._toUri(options.uri),
    };

    const run = Tracer.traceFunc(
      "Web3ApiClient: invoke",
      async (
        options: InvokeApiOptions<Uri>
      ): Promise<InvokeApiResult<TData>> => {
        const api = await this._loadWeb3Api(options.uri, invokeId);

        const result = (await api.invoke(
          options,
          wrapClient(this, invokeId)
        )) as TData;

        if (shouldClearContext) {
          this.clearInvokeContext(invokeId);
        }
        return result;
      }
    );

    return run(typedOptions);
  }

  @Tracer.traceMethod("Web3ApiClient: subscribe")
  public subscribe<
    TData extends Record<string, unknown> = Record<string, unknown>,
    TVariables extends Record<string, unknown> = Record<string, unknown>,
    TUri extends Uri | string = string
  >(options: SubscribeOptions<TVariables, TUri>): Subscription<TData> {
    const typedOptions: SubscribeOptions<TVariables, Uri> = {
      ...options,
      uri: this._toUri(options.uri),
    };

    const run = Tracer.traceFunc(
      "Web3ApiClient: subscribe",
      (options: SubscribeOptions<TVariables, Uri>): Subscription<TData> => {
        const { uri, query, variables, frequency: freq } = options;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const client: Web3ApiClient = this;

        // calculate interval between queries, in milliseconds, 1 min default value
        /* eslint-disable prettier/prettier */
        let frequency: number;
        if (freq && (freq.ms || freq.sec || freq.min || freq.hours)) {
          frequency =
            (freq.ms ?? 0) +
            ((freq.hours ?? 0) * 3600 +
              (freq.min ?? 0) * 60 +
              (freq.sec ?? 0)) *
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
          async *[Symbol.asyncIterator](): AsyncGenerator<
            QueryApiResult<TData>
          > {
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

                  const result: QueryApiResult<TData> = await client.query({
                    uri: uri,
                    query: query,
                    variables: variables,
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
    );

    return run(typedOptions);
  }

  private async _loadWeb3Api(uri: Uri, invokeContextId?: string): Promise<Api> {
    const typedUri = typeof uri === "string" ? new Uri(uri) : uri;

    const run = Tracer.traceFunc(
      "Web3ApiClient: _loadWeb3Api",
      async (uri: Uri): Promise<Api> => {
        let api = this._apiCache.get(uri.uri);

        if (!api) {
          const config = invokeContextId
            ? this.getInvokeContext(invokeContextId)
            : this._config;
          api = await resolveUri(
            uri,
            config.redirects,
            config.plugins,
            config.interfaces,
            <TData = unknown, TUri extends Uri | string = string>(
              options: InvokeApiOptions<TUri>
            ): Promise<InvokeApiResult<TData>> =>
              this.invoke<TData, TUri>(options),
            (uri: Uri, plugin: PluginPackage) => new PluginWeb3Api(uri, plugin),
            (uri: Uri, manifest: Web3ApiManifest, uriResolver: Uri) =>
              new WasmWeb3Api(uri, manifest, uriResolver)
          );

          if (!api) {
            throw Error(`Unable to resolve Web3API at uri: ${uri}`);
          }

          this._apiCache.set(uri.uri, api);
        }

        return api;
      }
    );

    return run(typedUri);
  }

  private _requirePluginsToUseNonInterfaceUris(): void {
    const pluginUris = this.plugins().map((x) => x.uri.uri);
    const interfaceUris = this.interfaces().map((x) => x.interface.uri);

    const pluginsWithInterfaceUris = pluginUris.filter((plugin) =>
      interfaceUris.includes(plugin)
    );

    if (pluginsWithInterfaceUris.length) {
      throw Error(
        `Plugins can't use interfaces for their URI. Invalid plugins: ${pluginsWithInterfaceUris}`
      );
    }
  }

  private _toUri(uri: Uri | string): Uri {
    if (typeof uri === "string") {
      return new Uri(uri);
    } else if (Uri.isUri(uri)) {
      return uri;
    } else {
      throw Error(`Unknown uri type, cannot convert. ${JSON.stringify(uri)}`);
    }
  }

  /**
   * Sets invoke context based on 2 cases:
   *  1. id sent andconfig sent -> use existing invoke context
   *  2. id not sent -> create new parent invoke context
   */
  private setInvokeContext(
    id?: string,
    config?: Partial<ClientConfig<Uri>>
  ): {
    id: string;
    shouldClearContext: boolean;
  } {
    if (id && !config) {
      return {
        id,
        shouldClearContext: false,
      };
    }

    const invokeId = uuid();

    const invokeRedirects = [...this.redirects()];
    if (config?.redirects) {
      invokeRedirects.push(...config.redirects);
    }

    this._overrides.set(invokeId, {
      redirects: invokeRedirects,
      plugins: this.plugins() as PluginRegistration<Uri>[],
      interfaces: this.interfaces() as InterfaceImplementations<Uri>[],
    });

    return {
      id: invokeId,
      shouldClearContext: true,
    };
  }

  private clearInvokeContext(id: string): void {
    this._overrides.delete(id);
  }
}

const wrapClient = (client: Client, id: string): Client => ({
  query: (options: QueryApiOptions<Record<string, unknown>, string | Uri>) =>
    client.query({ ...options, id }),
  invoke: (options: InvokeApiOptions<string | Uri>) =>
    client.invoke({ ...options, id }),
  subscribe: (
    options: SubscribeOptions<Record<string, unknown>, string | Uri>
  ) => client.subscribe({ ...options, id }),
  getInvokeContext: () => client.getInvokeContext(id),
  getFile: (uri: string | Uri, options: GetFileOptions) =>
    client.getFile(uri, options),
  getSchema: (uri: string | Uri) => client.getSchema(uri),
  getManifest: <TUri extends string | Uri, TManifestType extends ManifestType>(
    uri: TUri,
    options: GetManifestOptions<TManifestType>
  ) => client.getManifest(uri, options),
  getImplementations: <TUri extends Uri | string>(
    uri: TUri,
    options?: GetImplementationsOptions
  ) => client.getImplementations(uri, options),
});
