import { getDefaultClientConfig } from "./default-client-config";
import { PluginWeb3Api } from "./plugin/PluginWeb3Api";
import { WasmWeb3Api } from "./wasm";

import {
  AnyManifest,
  Api,
  ApiCache,
  Client,
  createQueryDocument,
  Dependency,
  DependencyType,
  GetDependenciesOptions,
  GetFileOptions,
  getImplementations,
  GetImplementationsOptions,
  GetImplementedInterfacesOptions,
  GetManifestOptions,
  ImplementedInterface,
  ImplementedType,
  InterfaceImplementations,
  InvokeApiOptions,
  InvokeApiResult,
  kindToType,
  ManifestType,
  parseQuery,
  PluginPackage,
  PluginRegistration,
  QueryApiOptions,
  QueryApiResult,
  resolveUri,
  sanitizeInterfaceImplementations,
  sanitizePluginRegistrations,
  sanitizeUriRedirects,
  Uri,
  UriRedirect,
  Web3ApiManifest,
  Subscription,
  SubscribeOptions,
} from "@web3api/core-js";
import { Tracer } from "@web3api/tracing-js";
import {
  DefinitionKind,
  InterfaceImplementedDefinition,
  ObjectDefinition,
  QueryDefinition,
  TypeInfo,
} from "@web3api/schema-parse";

export { WasmWeb3Api };

export interface ClientConfig<TUri = string> {
  redirects?: UriRedirect<TUri>[];
  plugins?: PluginRegistration<TUri>[];
  interfaces?: InterfaceImplementations<TUri>[];
  tracingEnabled?: boolean;
}

export class Web3ApiClient implements Client {
  // TODO: the API cache needs to be more like a routing table.
  // It should help us keep track of what URI's map to what APIs,
  // and handle cases where the are multiple jumps. For example, if
  // A => B => C, then the cache should have A => C, and B => C.
  private _apiCache: ApiCache = new Map<string, Api>();
  private _config: Required<ClientConfig<Uri>> = {
    redirects: [],
    plugins: [],
    interfaces: [],
    tracingEnabled: false,
  };

  constructor(config?: ClientConfig) {
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

  public redirects(): readonly UriRedirect<Uri>[] {
    return this._config.redirects || [];
  }

  public plugins(): readonly PluginRegistration<Uri>[] {
    return this._config.plugins || [];
  }

  public interfaces(): readonly InterfaceImplementations<Uri>[] {
    return this._config.interfaces || [];
  }

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

        return {
          data: data as TData,
          errors: errors.length === 0 ? undefined : errors,
        };
      }
    );

    return await run(typedOptions).catch((error: Error | Error[]) => {
      if (Array.isArray(error)) {
        return { errors: error };
      } else {
        return { errors: [error] };
      }
    });
  }

  public async invoke<TData = unknown, TUri extends Uri | string = string>(
    options: InvokeApiOptions<TUri>
  ): Promise<InvokeApiResult<TData>> {
    const typedOptions: InvokeApiOptions<Uri> = {
      ...options,
      uri: this._toUri(options.uri),
    };

    const run = Tracer.traceFunc(
      "Web3ApiClient: invoke",
      async (
        options: InvokeApiOptions<Uri>
      ): Promise<InvokeApiResult<TData>> => {
        const api = await this._loadWeb3Api(options.uri);

        const result = (await api.invoke(options, this)) as TData;

        return result;
      }
    );

    return run(typedOptions);
  }

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
          frequency = (freq.ms ?? 0) + ((
            (freq.hours ?? 0) * 3600 +
            (freq.min ?? 0) * 60 +
            (freq.sec ?? 0)
          ) * 1000);
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

  public async getDependencies(
    uri: Uri | string,
    options?: GetDependenciesOptions
  ): Promise<Dependency[]> {
    const typedUri: Uri = this._toUri(uri);

    const run = Tracer.traceFunc(
      "Web3ApiClient: getDependencies",
      async (
        uri: Uri,
        options?: GetDependenciesOptions
      ): Promise<Dependency[]> => {
        // retrieve type info
        const typeInfo: TypeInfo = JSON.parse(
          (await this.getFile(uri, {
            path: "typeInfo.json",
            encoding: "utf-8",
          })) as string
        );
        // simplify filters
        const includeObjects: boolean | undefined = options?.include?.includes(
          DependencyType.Object
        );
        const ignoreObjects: boolean | undefined = options?.ignore?.includes(
          DependencyType.Object
        );
        const includeEnums: boolean | undefined = options?.include?.includes(
          DependencyType.Enum
        );
        const ignoreEnums: boolean | undefined = options?.ignore?.includes(
          DependencyType.Enum
        );
        const includeQueries: boolean | undefined = options?.include?.includes(
          DependencyType.Query
        );
        const ignoreQueries: boolean | undefined = options?.ignore?.includes(
          DependencyType.Query
        );
        const includeInterfaces:
          | boolean
          | undefined = options?.include?.includes(DependencyType.Interface);
        const ignoreInterfaces: boolean | undefined = options?.ignore?.includes(
          DependencyType.Interface
        );
        // check for filter contradictions
        if (
          (includeObjects && ignoreObjects) ||
          (includeEnums && ignoreEnums) ||
          (includeQueries && ignoreQueries) ||
          (includeInterfaces && ignoreInterfaces)
        ) {
          throw Error("Cannot both include and ignore a DependencyType");
        }

        // filter list of imports by module
        const importList: Set<string> = new Set();
        if (options?.module) {
          typeInfo.queryTypes.forEach((queryType: QueryDefinition) => {
            if (
              options?.module === undefined ||
              options.module === queryType.type.toLowerCase()
            ) {
              queryType.imports.forEach((v: { type: string }) =>
                importList.add(v.type)
              );
            }
          });
        }

        // add interface namespaces to collection so we can identify interfaces
        const addInterfaces = (
          definitions: (QueryDefinition | ObjectDefinition)[],
          interfaceNamespaces: Set<string>
        ): void => {
          definitions.forEach((def: QueryDefinition | ObjectDefinition) => {
            def.interfaces.forEach((v: InterfaceImplementedDefinition) => {
              const ns: string = v.type.substring(0, v.type.indexOf("_"));
              interfaceNamespaces.add(ns);
            });
          });
        };
        const interfaceNS: Set<string> = new Set();
        addInterfaces(typeInfo.queryTypes, interfaceNS);
        addInterfaces(typeInfo.objectTypes, interfaceNS);

        const dependencies: Record<string, Dependency> = {};
        for (const definition of [
          ...typeInfo.importedObjectTypes,
          ...typeInfo.importedEnumTypes,
          ...typeInfo.importedQueryTypes,
        ]) {
          // apply filters
          const isInterface: boolean = interfaceNS.has(definition.namespace);
          const depType: DependencyType = kindToType(definition.kind);
          if (options) {
            // whitelist filter
            if (options.include) {
              if (!(isInterface && includeInterfaces)) {
                if (depType === DependencyType.Object && !includeObjects) {
                  continue;
                } else if (depType === DependencyType.Enum && !includeEnums) {
                  continue;
                } else if (
                  depType === DependencyType.Query &&
                  !includeQueries
                ) {
                  continue;
                }
              }
            }
            // blacklist filter
            if (options.ignore) {
              if (isInterface && ignoreInterfaces) {
                continue;
              }
              if (depType === DependencyType.Object && ignoreObjects) {
                continue;
              } else if (depType === DependencyType.Enum && ignoreEnums) {
                continue;
              } else if (depType === DependencyType.Query && ignoreQueries) {
                continue;
              }
            }
            // module filter
            if (options.module && !importList.has(definition.type)) {
              continue;
            }
          }
          // add
          if (!dependencies[definition.uri]) {
            dependencies[definition.uri] = {
              uri: definition.uri,
              namespace: definition.namespace,
              types: [],
            };
          }
          dependencies[definition.uri]?.types.push({
            name: definition.nativeType,
            type: depType,
            interface: isInterface,
          });
        }

        return Object.keys(dependencies).map<Dependency>(
          (uri: string) => dependencies[uri]
        );
      }
    );

    return run(typedUri, options);
  }

  public async getImplementedInterfaces(
    uri: Uri | string,
    options?: GetImplementedInterfacesOptions
  ): Promise<ImplementedInterface[]> {
    const typedUri: Uri = this._toUri(uri);

    const getImplementedInterfaces = Tracer.traceFunc(
      "Web3ApiClient: getImplementedInterfaces",
      async (
        uri: Uri,
        options?: GetImplementedInterfacesOptions
      ): Promise<ImplementedInterface[]> => {
        // retrieve type info
        const typeInfo: TypeInfo = JSON.parse(
          (await this.getFile(uri, {
            path: "typeInfo.json",
            encoding: "utf-8",
          })) as string
        );

        // simplify filters
        const ignoreObjects: boolean | undefined = options?.ignore?.includes(
          ImplementedType.Object
        );
        const ignoreQueries: boolean | undefined = options?.ignore?.includes(
          ImplementedType.Query
        );

        // get interface URI data
        const dependencies: Dependency[] = await this.getDependencies(uri, {
          include: [DependencyType.Interface],
        });
        const reducedDependencies: Record<string, string> = {};
        dependencies.forEach((dep: Dependency): void => {
          if (!reducedDependencies[dep.namespace]) {
            reducedDependencies[dep.namespace] = dep.uri;
          }
        });

        // add interfaces to collection
        const interfacesMap: Record<string, ImplementedInterface> = {};
        for (const definition of [
          ...typeInfo.objectTypes,
          ...typeInfo.queryTypes,
        ]) {
          // check for interface implementations
          if (definition.interfaces.length === 0) {
            continue;
          }
          // get implementedType and apply blacklist filter
          if (definition.kind === DefinitionKind.Object && ignoreObjects) {
            continue;
          }
          if (definition.kind === DefinitionKind.Query && ignoreQueries) {
            continue;
          }

          for (const implemented of definition.interfaces) {
            // get namespace and uri
            const iType: string = implemented.type;
            const [namespace, nativeType] = iType.split("_");
            const uri: string = reducedDependencies[namespace];
            // add interface
            if (!interfacesMap[definition.type]) {
              interfacesMap[definition.type] = {
                type: definition.type,
                interfaces: [],
              };
            }
            interfacesMap[definition.type]?.interfaces.push({
              uri: uri,
              type: nativeType,
              namespace: namespace,
            });
          }
        }
        return Object.keys(interfacesMap).map<ImplementedInterface>(
          (uri: string) => interfacesMap[uri]
        );
      }
    );

    return getImplementedInterfaces(typedUri, options);
  }

  private async _loadWeb3Api(uri: Uri): Promise<Api> {
    const typedUri = typeof uri === "string" ? new Uri(uri) : uri;

    const run = Tracer.traceFunc(
      "Web3ApiClient: _loadWeb3Api",
      async (uri: Uri): Promise<Api> => {
        let api = this._apiCache.get(uri.uri);

        if (!api) {
          api = await resolveUri(
            uri,
            this,
            this.redirects(),
            this.plugins(),
            this.interfaces(),
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
}
