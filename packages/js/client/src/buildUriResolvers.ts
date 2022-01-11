import { UriResolutionResult } from "@web3api/core-js/build/algorithms/uri-resolution/UriResolutionResult";
import { Web3ApiClientConfig, Uri, UriToApiResolver, RedirectsResolver, PluginResolver, PluginPackage, Api, ApiResolver, coreInterfaceUris, getImplementations, WasmWeb3Api, Web3ApiManifest, Client, Contextualized } from ".";
import { PluginWeb3Api } from "./plugin/PluginWeb3Api";

export const buildUriResolvers = (
  config: Readonly<Web3ApiClientConfig<Uri>>, 
  apiCache?: Map<string, Api>
): UriToApiResolver[] => {
  return [
    ...buildDefaultResolvers(apiCache),
    ...buildApiResolvers(config),
  ];
};

export const buildDefaultResolvers = (
  apiCache?: Map<string, Api>
): UriToApiResolver[] => {
  const resolvers: UriToApiResolver[] = [];
  
  const cacheResolver: UriToApiResolver | undefined = apiCache 
    ? {
        name: "Cache",
        async resolveUri(
          uri: Uri, 
          client: Client, 
          options: Contextualized
        ): Promise<UriResolutionResult> {
          const api = apiCache.get(uri.uri);
            
          return Promise.resolve({
            uri: uri,
            api: api,
          });
        }
      }
    : undefined;

  resolvers.push(new RedirectsResolver());
  
  if(cacheResolver) {
    resolvers.push(cacheResolver);
  }

  resolvers.push(
    new PluginResolver(
      (uri: Uri, plugin: PluginPackage) => new PluginWeb3Api(uri, plugin)
    )
  );

  return resolvers;
};

const buildApiResolvers = (
  config: Readonly<Web3ApiClientConfig<Uri>>,
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
      (uri: Uri, manifest: Web3ApiManifest, uriResolver: Uri, client: Client, options: Contextualized) => {
        const environment = client.getEnvByUri(uri, { contextId: options.contextId });
        return new WasmWeb3Api(uri, manifest, uriResolver, environment)
      }
    );

    resolvers.push(apiResolver);
  }

  return resolvers;
};
