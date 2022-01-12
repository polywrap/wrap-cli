import { ApiResolver, UriToApiResolver } from ".";
import { Uri, Client, Contextualized, getImplementations, coreInterfaceUris, Api, Web3ApiManifest, DeserializeManifestOptions } from "../..";
import { UriResolutionResult } from "./UriResolutionResult";

export type CreateApiFunc = (
  uri: Uri, 
  manifest: Web3ApiManifest, 
  uriResolver: Uri, 
  client: Client, 
  options: Contextualized
) => Api;

export type ApiAggregatorResolverResult = UriResolutionResult & {
  resolverUri?: Uri;
};

export class ApiAggregatorResolver implements UriToApiResolver {
  name = "ApiAggregator";

  constructor(
      private readonly createApi: CreateApiFunc,
      private deserializeOptions?: DeserializeManifestOptions
    ) {
  }

  async resolveUri(uri: Uri, client: Client, options: Contextualized): Promise<ApiAggregatorResolverResult> {
    const resolvers: ApiResolver[] = this.buildApiResolvers(client, options);

    for (const resolver of resolvers) {
      const result = await resolver.resolveUri(uri, client, options);

      if (result.api || (result.uri && uri.uri !== result.uri.uri)) {
        return {
          uri: result.uri,
          api: result.api,
          resolverUri: resolver.resolverUri,
        };
      }
    }

    return {
      uri,
    };
  }

  buildApiResolvers(
    client: Client, 
    options: Contextualized, 
  ): ApiResolver[] {
    const resolvers: ApiResolver[] = [];
  
    const resolverUris = getImplementations(
      coreInterfaceUris.uriResolver,
      client.getInterfaces(options),
      client.getRedirects(options)
    );
  
    for(const resolverUri of resolverUris) {
      const apiResolver = new ApiResolver(
        resolverUri,
        this.createApi,
        this.deserializeOptions
      );
  
      resolvers.push(apiResolver);
    }
  
    return resolvers;
  }
}