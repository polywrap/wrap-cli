import { Web3ApiClientConfig, Uri, UriToApiResolver, MaybeUriOrApi, RedirectsResolver, PluginResolver, PluginPackage, Api, ApiResolver, coreInterfaceUris, getImplementations, InvokeApiOptions, InvokeApiResult, WasmWeb3Api, Web3ApiManifest } from ".";
import { PluginWeb3Api } from "./plugin/PluginWeb3Api";

export const buildUriResolvers = (
  config: Readonly<Web3ApiClientConfig<Uri>>, 
  invoke: <TData = unknown, TUri extends Uri | string = string>(
    options: InvokeApiOptions<TUri>
  ) => Promise<InvokeApiResult<TData>>,
  createWasmWeb3Api: (uri: Uri, manifest: Web3ApiManifest, uriResolver: Uri) => WasmWeb3Api,
  apiCache?: Map<string, Api>
): UriToApiResolver[] => {
  return [
    ...buildDefaultResolvers(config, apiCache),
    ...buildApiResolvers(config, invoke, createWasmWeb3Api),
  ];
};

const buildDefaultResolvers = (
  config: Readonly<Web3ApiClientConfig<Uri>>, 
  apiCache?: Map<string, Api>
): UriToApiResolver[] => {
  const resolvers: UriToApiResolver[] = [];
  
  const cacheResolver: UriToApiResolver | undefined = apiCache 
    ? {
        name: "CacheResolver",
        async resolveUri(uri: Uri): Promise<MaybeUriOrApi> {
          const api = apiCache.get(uri.uri);
            
          return Promise.resolve({
            api,
          });
        }
      }
    : undefined;

  resolvers.push(new RedirectsResolver(config.redirects));
  
  if(cacheResolver) {
    resolvers.push(cacheResolver);
  }

  resolvers.push(
    new PluginResolver(
      config.plugins, 
      (uri: Uri, plugin: PluginPackage) => new PluginWeb3Api(uri, plugin)
    )
  );

  return resolvers;
};

const buildApiResolvers = (
  config: Readonly<Web3ApiClientConfig<Uri>>,
  invoke: <TData = unknown, TUri extends Uri | string = string>(
    options: InvokeApiOptions<TUri>
  ) => Promise<InvokeApiResult<TData>>,
  createWasmWeb3Api: (uri: Uri, manifest: Web3ApiManifest, uriResolver: Uri) => WasmWeb3Api
): UriToApiResolver[] => {
  const resolvers: UriToApiResolver[] = [];

  const resolverUris = getImplementations(
    coreInterfaceUris.uriResolver,
    config.interfaces,
    config.redirects
  );

  for(const resolverUri of resolverUris) {
    const apiResolver = new ApiResolver(
      resolverUri,
      invoke,
      createWasmWeb3Api
    );

    resolvers.push(apiResolver);
  }

  return resolvers;
};
